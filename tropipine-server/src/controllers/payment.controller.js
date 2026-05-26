const { prisma } = require('../config/db');

async function submitPayment(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Authentication required' });

    const {
      orderId,
      method: methodBody,
      paymentMethod,
      senderNumber,
      transactionId,
      amount: amountBody,
    } = req.body;

    const method = methodBody || paymentMethod;
    const amount = amountBody != null ? amountBody : undefined;

    if (!orderId || !method || !senderNumber || !transactionId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.userId !== userId) return res.status(403).json({ message: 'Not your order' });

    const existing = await prisma.payment.findUnique({ where: { transactionId } });
    if (existing) return res.status(409).json({ message: 'Transaction ID already used' });

    const payAmount = amount != null ? parseFloat(amount) : order.totalAmount;

    const payment = await prisma.payment.create({
      data: {
        orderId: order.id,
        method,
        senderNumber,
        transactionId,
        amount: payAmount,
        status: 'PENDING_VERIFICATION',
      },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus: 'PENDING_VERIFICATION' },
    });

    res.status(201).json({ payment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function verifyPayment(req, res) {
  try {
    const { id } = req.params;
    const adminId = req.user?.id;

    const payment = await prisma.payment.findUnique({ where: { id } });
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    if (payment.status !== 'PENDING_VERIFICATION') {
      return res.status(400).json({ message: 'Payment is not pending verification' });
    }

    await prisma.payment.update({
      where: { id },
      data: { status: 'PAID', verifiedAt: new Date(), verifiedBy: adminId },
    });

    await prisma.order.update({
      where: { id: payment.orderId },
      data: {
        paymentStatus: 'PAID',
        status: 'CONFIRMED',
        statusHistory: { create: { status: 'CONFIRMED', note: 'Payment verified by admin' } },
      },
    });

    res.json({ message: 'Payment verified successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function rejectPayment(req, res) {
  try {
    const { id } = req.params;
    const { note } = req.body;

    const payment = await prisma.payment.findUnique({ where: { id } });
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    if (payment.status !== 'PENDING_VERIFICATION') {
      return res.status(400).json({ message: 'Payment is not pending verification' });
    }

    await prisma.payment.update({
      where: { id },
      data: { status: 'FAILED', rejectionNote: note || null },
    });

    await prisma.order.update({
      where: { id: payment.orderId },
      data: { paymentStatus: 'FAILED' },
    });

    res.json({ message: 'Payment rejected', note: note || null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function getPaymentConfig(req, res) {
  try {
    const settings = await prisma.siteSettings.findMany({
      where: { key: { in: ['bkash_number', 'nagad_number', 'rocket_number'] } },
    });
    const data = {};
    settings.forEach((s) => { data[s.key] = s.value; });
    res.json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function updatePaymentConfig(req, res) {
  try {
    const { bkash_number, nagad_number, rocket_number } = req.body;
    const updates = [
      bkash_number && { key: 'bkash_number', value: bkash_number },
      nagad_number && { key: 'nagad_number', value: nagad_number },
      rocket_number && { key: 'rocket_number', value: rocket_number },
    ].filter(Boolean);

    for (const update of updates) {
      await prisma.siteSettings.upsert({
        where: { key: update.key },
        update: { value: update.value },
        create: { key: update.key, value: update.value },
      });
    }
    res.json({ message: 'Payment config updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function getAllPayments(req, res) {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const where = {};
    if (status) where.status = status;

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: { order: { include: { user: { select: { id: true, name: true, email: true } } } } },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.payment.count({ where }),
    ]);

    res.json({ data: payments, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { submitPayment, verifyPayment, rejectPayment, getPaymentConfig, updatePaymentConfig, getAllPayments };
