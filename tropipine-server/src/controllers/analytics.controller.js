const { prisma } = require('../config/db');

async function getAnalyticsOverview(req, res) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayRevenue = await prisma.order.aggregate({
      where: {
        createdAt: { gte: today },
        paymentStatus: 'PAID',
      },
      _sum: { totalAmount: true },
    });

    const totalOrders = await prisma.order.count();

    const pendingPayments = await prisma.payment.count({
      where: { status: 'PENDING_VERIFICATION' },
    });

    const lowStockProducts = await prisma.product.count({
      where: {
        stockQty: { lt: prisma.product.fields.lowStockThreshold },
      },
    });

    res.json({
      data: {
        todayRevenue: todayRevenue._sum.totalAmount || 0,
        totalOrders,
        pendingPayments,
        lowStockProducts,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function getRevenueAnalytics(req, res) {
  try {
    const period = req.query.period || 'month'; // month, week, day
    const now = new Date();
    let startDate = new Date();

    if (period === 'month') {
      startDate.setDate(1);
    } else if (period === 'week') {
      startDate.setDate(now.getDate() - 7);
    } else if (period === 'day') {
      startDate.setDate(now.getDate() - 1);
    }

    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startDate },
        paymentStatus: 'PAID',
      },
      select: { totalAmount: true, createdAt: true },
    });

    // Group by date
    const revenueByDate = {};
    orders.forEach((order) => {
      const date = order.createdAt.toISOString().split('T')[0];
      revenueByDate[date] = (revenueByDate[date] || 0) + order.totalAmount;
    });

    const data = Object.entries(revenueByDate).map(([date, revenue]) => ({
      date,
      revenue,
    }));

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

    const data = statuses.map((s) => ({
      name: s.status,
      count: s._count,
    }));

    res.json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function getTopProducts(req, res) {
  try {
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    });

    const productsWithNames = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { name: true },
        });
        return {
          name: product?.name || 'Unknown',
          sales: item._sum.quantity || 0,
        };
      })
    );

    res.json({ data: productsWithNames });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function getLowStockProducts(req, res) {
  try {
    const lowStockProducts = await prisma.product.findMany({
      where: {
        stockQty: { lt: prisma.product.fields.lowStockThreshold },
      },
      select: { id: true, name: true, stockQty: true, lowStockThreshold: true },
      take: 10,
    });

    res.json({ data: lowStockProducts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  getAnalyticsOverview,
  getRevenueAnalytics,
  getOrderStatusAnalytics,
  getTopProducts,
  getLowStockProducts,
};
