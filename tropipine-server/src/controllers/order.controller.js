const { prisma } = require('../config/db');

async function createOrder(req, res) {
  try {
    const userId = req.user?.id || null;

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
      guestName,
      guestEmail,
      guestPhone,
    } = req.body;

    if (!userId) {
      if (!guestName || !(guestPhone || phone)) {
        return res.status(400).json({ message: 'Name and phone are required for guest orders' });
      }
    }

    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ message: 'Cart is empty' });

    const productIds = items.map((i) => i.productId).filter(Boolean);
    if (productIds.length === 0) return res.status(400).json({ message: 'Invalid product IDs in cart' });

    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
    const productMap = new Map(products.map((p) => [p.id, p]));

    let subtotal = 0;
    const orderItemsData = [];

    const stockAlerts = [];
    for (const it of items) {
      const pid = it.productId;
      if (!pid) continue;
      const qty = parseFloat(it.quantity) || 1;
      const prod = productMap.get(pid);
      if (!prod) return res.status(400).json({ message: `Product ${pid} not found` });
      if (qty > prod.stockQty) {
        stockAlerts.push(`${prod.name} (ordered: ${qty}, stock: ${prod.stockQty})`);
      }
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
      let fullName = guestName || 'Customer';
      let contactPhone = guestPhone || phone || 'N/A';

      if (userId) {
        const dbUser = await prisma.user.findUnique({ where: { id: userId } });
        fullName = dbUser?.name || guestName || 'Customer';
        contactPhone = phone || dbUser?.phone || 'N/A';
      }

      const addr = await prisma.address.create({
        data: {
          userId: userId || null,
          label: 'Checkout',
          fullName,
          phone: contactPhone,
          street: address,
          city,
          district: city,
          postalCode: postalCode || null,
        },
      });
      resolvedAddressId = addr.id;
    }

    const resolvedGuestPhone = guestPhone || (!userId ? phone : null) || null;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        guestName: !userId ? (guestName || null) : null,
        guestEmail: !userId ? (guestEmail || null) : null,
        guestPhone: !userId ? resolvedGuestPhone : null,
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
        statusHistory: {
          createMany: {
            data: [
              { status: 'PENDING', note: 'Order placed' },
              ...(stockAlerts.length > 0
                ? [{ status: 'PENDING', note: `STOCK_ALERT: ${stockAlerts.join('; ')}` }]
                : []),
            ],
          },
        },
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

async function cancelGuestOrder(req, res) {
  try {
    const { orderNumber, phone } = req.body;
    if (!orderNumber || !phone) {
      return res.status(400).json({ message: 'Order number and phone are required' });
    }

    const order = await prisma.order.findFirst({
      where: { orderNumber: { equals: orderNumber, mode: 'insensitive' }, userId: null },
    });

    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.guestPhone !== phone) return res.status(403).json({ message: 'Phone does not match this order' });
    if (order.status !== 'PENDING') return res.status(400).json({ message: 'Only PENDING orders can be cancelled' });

    const updated = await prisma.order.update({
      where: { id: order.id },
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
    const andConditions = [];
    if (status) andConditions.push({ status });
    if (paymentStatus) andConditions.push({ paymentStatus });
    if (paymentMethod) andConditions.push({ paymentMethod });
    if (search) {
      andConditions.push({
        OR: [
          { orderNumber: { contains: search, mode: 'insensitive' } },
          { guestName: { contains: search, mode: 'insensitive' } },
          { guestPhone: { contains: search, mode: 'insensitive' } },
          { user: { name: { contains: search, mode: 'insensitive' } } },
          { payment: { transactionId: { contains: search, mode: 'insensitive' } } },
        ],
      });
    }
    const where = andConditions.length > 0 ? { AND: andConditions } : {};

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true } },
          items: { include: { product: { select: { stockQty: true } } } },
          payment: true,
          address: true,
          statusHistory: { orderBy: { changedAt: 'desc' }, take: 5 },
        },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where }),
    ]);

    const ordersWithCustomer = orders.map((o) => ({
      ...o,
      user: o.user || { id: null, name: o.guestName || 'Guest', email: o.guestEmail || '' },
      hasStockAlert: o.statusHistory?.some((h) => h.note?.startsWith('STOCK_ALERT:')) ?? false,
      stockAlertNote: o.statusHistory?.find((h) => h.note?.startsWith('STOCK_ALERT:'))?.note?.replace('STOCK_ALERT: ', '') ?? null,
    }));

    res.json({ data: ordersWithCustomer, total, page: parseInt(page), limit: parseInt(limit) });
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
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
      select: { stockQty: true },
    });
    const newQty = Math.max(0, (product?.stockQty ?? 0) - item.quantity);
    await prisma.product.update({
      where: { id: item.productId },
      data: { stockQty: newQty },
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
    if (existing.status === 'DELIVERED') {
      return res.status(400).json({ message: 'Cannot change status of a delivered order' });
    }

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
    const { orderNumber, email, phone } = req.query;
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

    if (order.userId) {
      // Authenticated order: optionally verify by email
      if (email && order.user && order.user.email.toLowerCase() !== email.toLowerCase()) {
        return res.status(403).json({ message: 'Email does not match this order' });
      }
    } else {
      // Guest order: verify by phone or email if provided
      if (phone && order.guestPhone && order.guestPhone !== phone) {
        return res.status(403).json({ message: 'Phone does not match this order' });
      }
      if (email && order.guestEmail && order.guestEmail.toLowerCase() !== email.toLowerCase()) {
        return res.status(403).json({ message: 'Email does not match this order' });
      }
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
        guestName: order.guestName,
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

    const [
      orderPendingTotal,
      paymentPendingTotal,
      latestOrders,
      latestPayments,
      stockAlertOrders,
    ] = await Promise.all([
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.payment.count({ where: { status: 'PENDING_VERIFICATION' } }),
      prisma.order.findMany({
        where: { createdAt: { gte: since } },
        orderBy: { createdAt: 'desc' },
        take: 6,
        include: { user: { select: { name: true } } },
      }),
      prisma.payment.findMany({
        where: { createdAt: { gte: since } },
        orderBy: { createdAt: 'desc' },
        take: 6,
        include: {
          order: {
            select: {
              orderNumber: true,
              guestName: true,
              totalAmount: true,
              user: { select: { name: true } },
            },
          },
        },
      }),
      prisma.orderStatusHistory.findMany({
        where: { note: { startsWith: 'STOCK_ALERT:' }, changedAt: { gte: since } },
        orderBy: { changedAt: 'desc' },
        take: 10,
        include: { order: { select: { id: true, orderNumber: true, guestName: true, user: { select: { name: true } } } } },
      }),
    ]);

    const ordersFormatted = latestOrders.map((o) => ({
      type: 'order',
      id: o.id,
      orderNumber: o.orderNumber,
      totalAmount: o.totalAmount,
      createdAt: o.createdAt,
      customerName: o.user?.name || o.guestName || 'Guest',
    }));

    const paymentsFormatted = latestPayments.map((p) => ({
      type: 'payment',
      id: p.id,
      orderNumber: p.order?.orderNumber,
      amount: p.amount,
      method: p.method,
      createdAt: p.createdAt,
      customerName: p.order?.user?.name || p.order?.guestName || 'Guest',
    }));

    const stockAlertsFormatted = stockAlertOrders.map((h) => ({
      type: 'stock_alert',
      id: h.id,
      orderId: h.order?.id,
      orderNumber: h.order?.orderNumber,
      createdAt: h.changedAt,
      customerName: h.order?.user?.name || h.order?.guestName || 'Guest',
      detail: h.note.replace('STOCK_ALERT: ', ''),
    }));

    res.json({
      data: {
        orders: { pendingCount: orderPendingTotal, latest: ordersFormatted },
        payments: { pendingCount: paymentPendingTotal, latest: paymentsFormatted },
        stockAlerts: { count: stockAlertsFormatted.length, latest: stockAlertsFormatted },
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function adminCreateOrder(req, res) {
  try {
    const {
      guestName,
      guestPhone,
      guestEmail,
      address,
      city,
      postalCode,
      items,
      paymentMethod = 'CASH_ON_DELIVERY',
      paymentStatus,
      deliveryCharge = 0,
      specialNote,
    } = req.body;

    if (!guestName || !guestPhone) {
      return res.status(400).json({ message: 'Customer name and phone are required' });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'At least one item is required' });
    }

    const productIds = items.map((i) => i.productId).filter(Boolean);
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
    const productMap = new Map(products.map((p) => [p.id, p]));

    let subtotal = 0;
    const orderItemsData = [];
    for (const it of items) {
      const prod = productMap.get(it.productId);
      if (!prod) return res.status(400).json({ message: `Product not found: ${it.productId}` });
      const qty = parseFloat(it.quantity) || 1;
      const lineTotal = prod.finalPrice * qty;
      subtotal += lineTotal;
      orderItemsData.push({ productId: it.productId, productName: prod.name, unitPrice: prod.finalPrice, quantity: qty, subtotal: lineTotal });
    }

    const totalAmount = subtotal + (parseFloat(deliveryCharge) || 0);

    const now = new Date();
    const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
    const seq = String(now.getTime() % 10000).padStart(4, '0');
    const orderNumber = `TP-${datePart}-${seq}`;

    let resolvedAddressId = null;
    if (address && city) {
      const addr = await prisma.address.create({
        data: {
          userId: null,
          label: 'Manual Order',
          fullName: guestName,
          phone: guestPhone,
          street: address,
          city,
          district: city,
          postalCode: postalCode || null,
        },
      });
      resolvedAddressId = addr.id;
    }

    const resolvedPaymentStatus = paymentStatus || (paymentMethod === 'CASH_ON_DELIVERY' ? 'PAID' : 'UNPAID');

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: null,
        guestName,
        guestEmail: guestEmail || null,
        guestPhone,
        addressId: resolvedAddressId,
        couponDiscount: 0,
        subtotal,
        deliveryCharge: parseFloat(deliveryCharge) || 0,
        totalAmount,
        status: 'CONFIRMED',
        paymentMethod,
        paymentStatus: resolvedPaymentStatus,
        specialNote: specialNote || null,
        items: { create: orderItemsData },
        statusHistory: { create: { status: 'CONFIRMED', note: 'Order created manually by admin' } },
      },
      include: { items: true },
    });

    res.status(201).json({ data: order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

module.exports = {
  createOrder,
  myOrders,
  getMyOrderById,
  cancelOrder,
  cancelGuestOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  trackOrder,
  getRecentPendingCount,
  adminCreateOrder,
};
