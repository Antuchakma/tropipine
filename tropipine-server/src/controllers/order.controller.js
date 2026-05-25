const { prisma } = require('../config/db');

async function createOrder(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Authentication required' });

    const { items, deliveryCharge = 0, couponCode, paymentMethod } = req.body;
    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ message: 'Cart is empty' });

    // Fetch products and calculate subtotal
    const productIds = items
      .map((i) => {
        const id = typeof i.productId === 'string' ? parseInt(i.productId, 10) : i.productId;
        return isNaN(id) ? null : id;
      })
      .filter((id) => id !== null);

    if (productIds.length === 0) {
      return res.status(400).json({ message: 'Invalid product IDs in cart' });
    }

    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
    const productMap = new Map(products.map((p) => [p.id, p]));

    let subtotal = 0;
    const orderItemsData = [];
    for (const it of items) {
      const pid = typeof it.productId === 'string' ? parseInt(it.productId, 10) : it.productId;
      if (isNaN(pid)) continue; // Skip invalid product IDs
      
      const qty = parseInt(it.quantity, 10) || 1;
      const prod = productMap.get(pid);
      if (!prod) return res.status(400).json({ message: `Product ${pid} not found` });
      const line = prod.price * qty;
      subtotal += line;
      orderItemsData.push({ productId: pid, productName: prod.name, unitPrice: prod.price, quantity: qty, subtotal: line });
    }

    if (orderItemsData.length === 0) {
      return res.status(400).json({ message: 'No valid items in cart' });
    }

    let couponId = null;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
      if (coupon && coupon.isActive && subtotal >= coupon.minOrderAmount) {
        couponId = coupon.id;
        if (coupon.type === 'PERCENTAGE') {
          const discount = Math.min((subtotal * coupon.value) / 100, coupon.value || Infinity);
          subtotal -= discount;
        } else {
          subtotal -= coupon.value;
        }
      }
    }

    const totalAmount = subtotal + (parseFloat(deliveryCharge) || 0);

    // generate a simple order number
    const orderNumber = `TP-${Date.now()}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: userId,
        couponId: couponId,
        subtotal,
        deliveryCharge: parseFloat(deliveryCharge) || 0,
        totalAmount,
        status: 'PENDING',
        paymentMethod: paymentMethod || 'CASH_ON_DELIVERY',
        paymentStatus: paymentMethod === 'CASH_ON_DELIVERY' ? 'PAID' : 'UNPAID',
        items: { create: orderItemsData },
      },
      include: { items: true },
    });

    res.status(201).json({ order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function myOrders(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Authentication required' });

    const orders = await prisma.order.findMany({ where: { userId }, include: { items: true, payment: true } });
    res.json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function getAllOrders(req, res) {
  try {
    const { status, paymentStatus, page = 1, limit = 20 } = req.query;
    const where = {};
    if (status) where.status = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;

    const orders = await prisma.order.findMany({
      where,
      include: { user: true, items: true, payment: true },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.order.count({ where });

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
      include: { user: true, items: true, payment: true },
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
    const { status } = req.body;

    if (!status) return res.status(400).json({ message: 'Status is required' });

    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });

    res.json({ data: order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { createOrder, myOrders, getAllOrders, getOrderById, updateOrderStatus };
