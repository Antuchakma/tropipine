const { prisma } = require('../config/db');

async function getWishlist(req, res) {
  try {
    const userId = req.user?.id;
    const wishlist = await prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: {
          include: { images: { where: { isPrimary: true }, take: 1 }, category: true },
        },
      },
      orderBy: { addedAt: 'desc' },
    });
    res.json({ data: wishlist });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function addToWishlist(req, res) {
  try {
    const userId = req.user?.id;
    const { productId } = req.params;

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const item = await prisma.wishlist.upsert({
      where: { userId_productId: { userId, productId } },
      update: {},
      create: { userId, productId },
    });
    res.status(201).json({ data: item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function removeFromWishlist(req, res) {
  try {
    const userId = req.user?.id;
    const { productId } = req.params;

    await prisma.wishlist.deleteMany({ where: { userId, productId } });
    res.json({ message: 'Removed from wishlist' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
