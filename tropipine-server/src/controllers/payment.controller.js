const { prisma } = require('../config/db');

async function submitPayment(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Authentication required' });

    const { orderId, method, senderNumber, transactionId, amount } = req.body;
    if (!orderId || !method || !senderNumber || !transactionId || !amount) return res.status(400).json({ message: 'Missing fields' });

    const order = await prisma.order.findUnique({ where: { id: parseInt(orderId, 10) } });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.userId !== userId) return res.status(403).json({ message: 'Not your order' });

    const existing = await prisma.payment.findUnique({ where: { transactionId } }).catch(() => null);
    if (existing) return res.status(409).json({ message: 'Transaction ID already used' });

    const payment = await prisma.payment.create({ data: { orderId: order.id, method, senderNumber, transactionId, amount: parseFloat(amount), status: 'PENDING_VERIFICATION' } });

    await prisma.order.update({ where: { id: order.id }, data: { paymentStatus: 'PENDING_VERIFICATION' } });

    res.status(201).json({ payment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function verifyPayment(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const payment = await prisma.payment.findUnique({ where: { id } });
    if (!payment) return res.status(404).json({ message: 'Not found' });

    await prisma.payment.update({ where: { id }, data: { status: 'PAID', verifiedAt: new Date() } });
    await prisma.order.update({ where: { id: payment.orderId }, data: { paymentStatus: 'PAID', status: 'CONFIRMED' } });

    res.json({ message: 'Payment verified' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function rejectPayment(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const { note } = req.body;
    const payment = await prisma.payment.findUnique({ where: { id } });
    if (!payment) return res.status(404).json({ message: 'Not found' });

    await prisma.payment.update({ where: { id }, data: { status: 'FAILED' } });
    await prisma.order.update({ where: { id: payment.orderId }, data: { paymentStatus: 'FAILED' } });

    res.json({ message: 'Payment rejected', note: note || null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { submitPayment, verifyPayment, rejectPayment };
