const { prisma } = require('../config/db');

async function createOrder(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Authentication required' });

    const { items, addressId, deliveryCharge = 0, couponCode, paymentMethod, specialNote } = req.body;
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

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        addressId: addressId || null,
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

    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: true, payment: true, address: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ orders });
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

async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, note } = req.body;
    if (!status) return res.status(400).json({ message: 'Status is required' });

    const validStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];
    if (!validStatuses.includes(status)) return res.status(400).json({ message: 'Invalid status' });

    const order = await prisma.order.update({
      where: { id },
      data: {
        status,
        statusHistory: { create: { status, note: note || null } },
      },
    });
    res.json({ data: order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { createOrder, myOrders, getMyOrderById, cancelOrder, getAllOrders, getOrderById, updateOrderStatus };
