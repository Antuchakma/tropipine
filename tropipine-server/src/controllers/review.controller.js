const { prisma } = require('../config/db');

async function getProductReviews(req, res) {
  try {
    const { productId } = req.params;
    const reviews = await prisma.review.findMany({
      where: { productId, isApproved: true },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    res.json({ data: reviews, avgRating: parseFloat(avgRating.toFixed(1)), count: reviews.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function submitReview(req, res) {
  try {
    const userId = req.user?.id;
    const { productId, rating, comment, orderId } = req.body;

    if (!productId || !rating) return res.status(400).json({ message: 'productId and rating are required' });
    if (rating < 1 || rating > 5) return res.status(400).json({ message: 'Rating must be between 1 and 5' });

    // Check if user already reviewed this product
    const existing = await prisma.review.findFirst({ where: { userId, productId } });
    if (existing) return res.status(409).json({ message: 'You have already reviewed this product' });

    // If orderId provided, verify it belongs to this user and is DELIVERED
    if (orderId) {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });
      if (!order || order.userId !== userId) {
        return res.status(403).json({ message: 'Order not found or not yours' });
      }
      if (order.status !== 'DELIVERED') {
        return res.status(400).json({ message: 'Can only review delivered orders' });
      }
      const hasProduct = order.items.some((i) => i.productId === productId);
      if (!hasProduct) return res.status(400).json({ message: 'Product not in this order' });
    }

    const review = await prisma.review.create({
      data: {
        userId,
        productId,
        orderId: orderId || null,
        rating: parseInt(rating),
        comment: comment || null,
        isApproved: false,
      },
      include: { user: { select: { id: true, name: true } } },
    });

    res.status(201).json({ data: review, message: 'Review submitted and pending approval' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function getAllReviews(req, res) {
  try {
    const { isApproved, page = 1, limit = 20 } = req.query;
    const where = {};
    if (isApproved !== undefined) where.isApproved = isApproved === 'true';

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true } },
          product: { select: { id: true, name: true } },
        },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.review.count({ where }),
    ]);

    res.json({ data: reviews, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function approveReview(req, res) {
  try {
    const { id } = req.params;
    const review = await prisma.review.update({
      where: { id },
      data: { isApproved: true },
    });
    res.json({ data: review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function deleteReview(req, res) {
  try {
    const { id } = req.params;
    await prisma.review.delete({ where: { id } });
    res.json({ message: 'Review deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { getProductReviews, submitReview, getAllReviews, approveReview, deleteReview };
