const { prisma } = require('../config/db');

async function getRevenueAnalytics(req, res) {
  try {
    const period = req.query.period || 'month';
    const now = new Date();
    const startDate = new Date();

    if (period === 'month') {
      startDate.setDate(1);
    } else if (period === 'week') {
      startDate.setDate(now.getDate() - 7);
    } else {
      startDate.setDate(now.getDate() - 1);
    }

    const orders = await prisma.order.findMany({
      where: { createdAt: { gte: startDate }, paymentStatus: 'PAID' },
      select: { totalAmount: true, createdAt: true },
    });

    const revenueByDate = {};
    orders.forEach((order) => {
      const date = order.createdAt.toISOString().split('T')[0];
      revenueByDate[date] = (revenueByDate[date] || 0) + order.totalAmount;
    });

    const data = Object.entries(revenueByDate)
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => a.date.localeCompare(b.date));

    res.json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function getOrderStatusAnalytics(req, res) {
  try {
    const statuses = await prisma.order.groupBy({
      by: ['status'],
      _count: true,
    });

    const data = statuses.map((s) => ({ name: s.status, count: s._count }));
    res.json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function getTopProducts(req, res) {
  try {
    const topItems = await prisma.orderItem.groupBy({
      by: ['productId', 'productName'],
      _sum: { quantity: true, subtotal: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    });

    const data = topItems.map((item) => ({
      name: item.productName,
      sales: item._sum.quantity || 0,
      revenue: item._sum.subtotal || 0,
    }));

    res.json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function getLowStockProducts(req, res) {
  try {
    // Use $queryRaw for column-to-column comparison (stockQty < lowStockThreshold)
    const lowStockProducts = await prisma.$queryRaw`
      SELECT id, name, "stockQty", "lowStockThreshold", unit
      FROM "Product"
      WHERE "stockQty" < "lowStockThreshold" AND "isAvailable" = true
      LIMIT 20
    `;
    res.json({ data: lowStockProducts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { getRevenueAnalytics, getOrderStatusAnalytics, getTopProducts, getLowStockProducts };
