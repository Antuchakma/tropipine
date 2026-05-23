const { prisma } = require('../config/db');

async function createOrder(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Authentication required' });

    const { items, deliveryCharge = 0, couponCode, paymentMethod } = req.body;
    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ message: 'Cart is empty' });

    // Fetch products and calculate subtotal
    const productIds = items.map((i) => parseInt(i.productId, 10));
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
    const productMap = new Map(products.map((p) => [p.id, p]));

    let subtotal = 0;
    const orderItemsData = [];
    for (const it of items) {
      const pid = parseInt(it.productId, 10);
      const qty = parseInt(it.quantity, 10) || 1;
      const prod = productMap.get(pid);
      if (!prod) return res.status(400).json({ message: `Product ${pid} not found` });
      const line = prod.price * qty;
      subtotal += line;
      orderItemsData.push({ productId: pid, productName: prod.name, unitPrice: prod.price, quantity: qty, subtotal: line });
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

module.exports = { createOrder, myOrders };
