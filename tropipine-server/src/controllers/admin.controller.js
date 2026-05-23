const { prisma } = require('../config/db');

async function overview(req, res) {
  try {
    const [users, products, orders, pendingPayments] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.payment.count({ where: { status: 'PENDING_VERIFICATION' } }),
    ]);
    res.json({ users, products, orders, pendingPayments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function listUsers(req, res) {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '20', 10);
    const skip = (page - 1) * limit;
    const users = await prisma.user.findMany({ skip, take: limit, select: { id: true, name: true, email: true, role: true, createdAt: true } });
    const total = await prisma.user.count();
    res.json({ users, total, page, limit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function listOrders(req, res) {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '20', 10);
    const skip = (page - 1) * limit;
    const orders = await prisma.order.findMany({ skip, take: limit, include: { items: true, payment: true } });
    const total = await prisma.order.count();
    res.json({ orders, total, page, limit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { overview, listUsers, listOrders };
