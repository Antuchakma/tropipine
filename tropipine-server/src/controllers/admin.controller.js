const { prisma } = require('../config/db');

async function overview(req, res) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalOrders, pendingPayments, totalUsers, todayRevenueAgg, lowStockResult] = await Promise.all([
      prisma.order.count(),
      prisma.payment.count({ where: { status: 'PENDING_VERIFICATION' } }),
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.order.aggregate({
        where: { createdAt: { gte: today }, paymentStatus: 'PAID' },
        _sum: { totalAmount: true },
      }),
      prisma.$queryRaw`SELECT COUNT(*) as count FROM "Product" WHERE "stockQty" < "lowStockThreshold"`,
    ]);

    res.json({
      data: {
        todayRevenue: todayRevenueAgg._sum.totalAmount || 0,
        totalOrders,
        pendingPayments,
        totalUsers,
        lowStockProducts: Number(lowStockResult[0]?.count || 0),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function listUsers(req, res) {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const where = { role: 'USER' };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
        select: {
          id: true, name: true, email: true, phone: true, role: true,
          isActive: true, createdAt: true,
          _count: { select: { orders: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({ data: users, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function getUserById(req, res) {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true, name: true, email: true, phone: true, role: true,
        isActive: true, createdAt: true,
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: { items: true },
        },
        addresses: true,
      },
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function toggleUserActive(req, res) {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const updated = await prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
      select: { id: true, name: true, email: true, isActive: true },
    });
    res.json({ data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function changeUserRole(req, res) {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const validRoles = ['USER', 'ADMIN', 'SUPER_ADMIN'];
    if (!validRoles.includes(role)) return res.status(400).json({ message: 'Invalid role' });

    const updated = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });
    res.json({ data: updated });
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

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        skip,
        take: limit,
        include: { items: true, payment: true, user: { select: { name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count(),
    ]);

    res.json({ orders, total, page, limit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { overview, listUsers, getUserById, toggleUserActive, changeUserRole, listOrders };
