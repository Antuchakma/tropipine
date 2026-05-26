const { prisma } = require('../config/db');

async function createOrder(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Authentication required' });

    const {
      items,
      addressId,
      deliveryCharge = 0,
      couponCode,
      paymentMethod,
      specialNote,
      address,
      city,
      postalCode,
      phone,
    } = req.body;
    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ message: 'Cart is empty' });

    const productIds = items.map((i) => i.productId).filter(Boolean);
    if (productIds.length === 0) return res.status(400).json({ message: 'Invalid product IDs in cart' });

    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
    const productMap = new Map(products.map((p) => [p.id, p]));

    let subtotal = 0;
    const orderItemsData = [];

    for (const it of items) {
      const pid = it.productId;
      if (!pid) continue;
      const qty = parseFloat(it.quantity) || 1;
      const prod = productMap.get(pid);
      if (!prod) return res.status(400).json({ message: `Product ${pid} not found` });
      const unitPrice = prod.finalPrice;
      const lineTotal = unitPrice * qty;
      subtotal += lineTotal;
      orderItemsData.push({ productId: pid, productName: prod.name, unitPrice, quantity: qty, subtotal: lineTotal });
    }

    if (orderItemsData.length === 0) return res.status(400).json({ message: 'No valid items in cart' });

    let couponId = null;
    let couponDiscount = 0;

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
      if (coupon && coupon.isActive && subtotal >= coupon.minOrderAmount) {
        const notExpired = !coupon.expiresAt || new Date() < coupon.expiresAt;
        const underLimit = !coupon.usageLimit || coupon.usedCount < coupon.usageLimit;
        if (notExpired && underLimit) {
          couponId = coupon.id;
          if (coupon.type === 'PERCENTAGE') {
            couponDiscount = Math.min((subtotal * coupon.value) / 100, coupon.maxDiscount ?? Infinity);
          } else {
            couponDiscount = Math.min(coupon.value, subtotal);
          }
          await prisma.coupon.update({ where: { id: coupon.id }, data: { usedCount: { increment: 1 } } });
        }
      }
    }

    const totalAmount = subtotal - couponDiscount + (parseFloat(deliveryCharge) || 0);

    const now = new Date();
    const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
    const seq = String(now.getTime() % 10000).padStart(4, '0');
    const orderNumber = `TP-${datePart}-${seq}`;

    let resolvedAddressId = addressId || null;
    if (!resolvedAddressId && address && city) {
      const dbUser = await prisma.user.findUnique({ where: { id: userId } });
      const addr = await prisma.address.create({
        data: {
          userId,
          label: 'Checkout',
          fullName: dbUser?.name || 'Customer',
          phone: phone || dbUser?.phone || 'N/A',
          street: address,
          city,
          district: city,
          postalCode: postalCode || null,
        },
      });
      resolvedAddressId = addr.id;
    }

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        addressId: resolvedAddressId,
        couponId,
        couponDiscount,
        subtotal,
        deliveryCharge: parseFloat(deliveryCharge) || 0,
        totalAmount,
        status: 'PENDING',
        paymentMethod: paymentMethod || 'CASH_ON_DELIVERY',
        paymentStatus: paymentMethod === 'CASH_ON_DELIVERY' ? 'PAID' : 'UNPAID',
        specialNote: specialNote || null,
        items: { create: orderItemsData },
        statusHistory: { create: { status: 'PENDING', note: 'Order placed' } },
      },
      include: { items: true },
    });

    res.status(201).json({ order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function myOrders(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Authentication required' });

    const { product, month, year, sort = 'newest' } = req.query;
    const where = { userId };

    if (month && year) {
      const m = parseInt(month, 10);
      const y = parseInt(year, 10);
      const start = new Date(y, m - 1, 1);
      const end = new Date(y, m, 1);
      where.createdAt = { gte: start, lt: end };
    }

    let orderBy = { createdAt: 'desc' };
    if (sort === 'oldest') orderBy = { createdAt: 'asc' };
    else if (sort === 'amount_desc') orderBy = { totalAmount: 'desc' };
    else if (sort === 'amount_asc') orderBy = { totalAmount: 'asc' };

    let orders = await prisma.order.findMany({
      where,
      include: { items: true, payment: true, address: true },
      orderBy,
    });

    if (product) {
      const q = product.toLowerCase();
      orders = orders.filter((o) =>
        o.items.some((item) => item.productName.toLowerCase().includes(q))
      );
    }

    res.json({ orders, items: orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function getMyOrderById(req, res) {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true, payment: true, address: true, statusHistory: { orderBy: { changedAt: 'asc' } } },
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.userId !== userId) return res.status(403).json({ message: 'Not your order' });
    res.json({ data: order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function cancelOrder(req, res) {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.userId !== userId) return res.status(403).json({ message: 'Not your order' });
    if (order.status !== 'PENDING') return res.status(400).json({ message: 'Only PENDING orders can be cancelled' });

    const updated = await prisma.order.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        statusHistory: { create: { status: 'CANCELLED', note: 'Cancelled by customer' } },
      },
    });
    res.json({ data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function getAllOrders(req, res) {
  try {
    const { status, paymentStatus, paymentMethod, search, page = 1, limit = 20 } = req.query;
    const where = {};
    if (status) where.status = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;
    if (paymentMethod) where.paymentMethod = paymentMethod;
    if (search) where.orderNumber = { contains: search, mode: 'insensitive' };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { user: { select: { id: true, name: true, email: true } }, items: true, payment: true, address: true },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where }),
    ]);

    res.json({ data: orders, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function getOrderById(req, res) {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        items: true,
        payment: true,
        address: true,
        statusHistory: { orderBy: { changedAt: 'asc' } },
      },
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ data: order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function deductStockForOrder(orderId) {
  const items = await prisma.orderItem.findMany({ where: { orderId } });
  for (const item of items) {
    await prisma.product.update({
      where: { id: item.productId },
      data: { stockQty: { decrement: item.quantity } },
    });
  }
}

async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, note } = req.body;
    if (!status) return res.status(400).json({ message: 'Status is required' });

    const validStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];
    if (!validStatuses.includes(status)) return res.status(400).json({ message: 'Invalid status' });

    const existing = await prisma.order.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: 'Order not found' });

    const order = await prisma.order.update({
      where: { id },
      data: {
        status,
        statusHistory: { create: { status, note: note || null } },
      },
    });

    if (status === 'DELIVERED' && existing.status !== 'DELIVERED') {
      await deductStockForOrder(id);
    }

    res.json({ data: order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function trackOrder(req, res) {
  try {
    const { orderNumber, email } = req.query;
    if (!orderNumber) return res.status(400).json({ message: 'Order number is required' });

    const order = await prisma.order.findFirst({
      where: { orderNumber: { equals: orderNumber, mode: 'insensitive' } },
      include: {
        items: true,
        address: true,
        statusHistory: { orderBy: { changedAt: 'asc' } },
        user: { select: { email: true, name: true } },
      },
    });

    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (email && order.user.email.toLowerCase() !== email.toLowerCase()) {
      return res.status(403).json({ message: 'Email does not match this order' });
    }

    res.json({
      data: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        totalAmount: order.totalAmount,
        subtotal: order.subtotal,
        deliveryCharge: order.deliveryCharge,
        createdAt: order.createdAt,
        items: order.items,
        address: order.address,
        statusHistory: order.statusHistory,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function getRecentPendingCount(req, res) {
  try {
    const since = req.query.since ? new Date(req.query.since) : new Date(Date.now() - 24 * 60 * 60 * 1000);
    const count = await prisma.order.count({
      where: { status: 'PENDING', createdAt: { gte: since } },
    });
    const latest = await prisma.order.findMany({
      where: { createdAt: { gte: since } },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { user: { select: { name: true } } },
    });
    res.json({ data: { count, latest } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  createOrder,
  myOrders,
  getMyOrderById,
  cancelOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  trackOrder,
  getRecentPendingCount,
};
