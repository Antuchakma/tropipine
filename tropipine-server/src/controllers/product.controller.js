const { prisma } = require('../config/db');
const { uploadImage, destroyImage } = require('../services/cloudinary.service');

function calculateFinalPrice(basePrice, discountPercent, discountAmount) {
  let final = basePrice;
  if (discountPercent > 0) {
    final = basePrice - (basePrice * discountPercent) / 100;
  } else if (discountAmount > 0) {
    final = basePrice - discountAmount;
  }
  return Math.max(0, parseFloat(final.toFixed(2)));
}

async function listFruitTypes(req, res) {
  try {
    const rows = await prisma.product.groupBy({
      by: ['fruitType'],
      where: { fruitType: { not: null }, isAvailable: true },
      _count: { _all: true },
    });
    const types = rows
      .map((r) => ({ type: r.fruitType, count: r._count._all }))
      .filter((t) => t.type)
      .sort((a, b) => a.type.localeCompare(b.type));
    res.json({ data: types });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function listProducts(req, res) {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      minPrice,
      maxPrice,
      inStock,
      isExclusive,
      isFeatured,
      isBestSeller,
      isSeasonal,
      search,
      sortBy,
      fruitType,
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = {};

    if (category) {
      const cat = await prisma.category.findFirst({ where: { slug: category } });
      if (cat) where.categoryId = cat.id;
    }
    if (minPrice || maxPrice) {
      where.finalPrice = {};
      if (minPrice) where.finalPrice.gte = parseFloat(minPrice);
      if (maxPrice) where.finalPrice.lte = parseFloat(maxPrice);
    }
    if (inStock === 'true') where.stockQty = { gt: 0 };
    if (isExclusive === 'true') where.isExclusive = true;
    if (isFeatured === 'true') where.isFeatured = true;
    if (isBestSeller === 'true') where.isBestSeller = true;
    if (isSeasonal === 'true') where.isSeasonal = true;
    if (fruitType) {
      where.fruitType = { equals: fruitType, mode: 'insensitive' };
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search.toLowerCase() } },
        { fruitType: { contains: search, mode: 'insensitive' } },
        { variant: { contains: search, mode: 'insensitive' } },
      ];
    }

    let orderBy = { sortOrder: 'asc' };
    if (sortBy === 'price_asc') orderBy = { finalPrice: 'asc' };
    else if (sortBy === 'price_desc') orderBy = { finalPrice: 'desc' };
    else if (sortBy === 'newest') orderBy = { createdAt: 'desc' };
    else if (sortBy === 'popular') orderBy = { isBestSeller: 'desc' };

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: parseInt(limit),
        where,
        orderBy,
        include: { images: { orderBy: { sortOrder: 'asc' } }, category: true },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({ items, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function getProduct(req, res) {
  try {
    const { id } = req.params;
    // Support both id and slug lookup
    const product = await prisma.product.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        category: true,
        reviews: {
          where: { isApproved: true },
          include: { user: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Calculate average rating
    const avgRating =
      product.reviews.length > 0
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
        : 0;

    res.json({ ...product, avgRating: parseFloat(avgRating.toFixed(1)) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function createProduct(req, res) {
  try {
    const {
      name, slug, description, nutritionInfo, categoryId, basePrice,
      discountPercent, discountAmount, unit, minOrderQty, maxOrderQty,
      stockQty, lowStockThreshold, isAvailable, isFeatured, isBestSeller,
      isExclusive, exclusiveLabel, isSeasonal, seasonStart, seasonEnd,
      origin, harvestDate, shelfLife, tags, sortOrder, fruitType, variant,
    } = req.body;

    if (!name || !description || basePrice == null) {
      return res.status(400).json({ message: 'name, description, and basePrice are required' });
    }

    const bp = parseFloat(basePrice);
    const dp = parseFloat(discountPercent || 0);
    const da = parseFloat(discountAmount || 0);
    const finalPrice = calculateFinalPrice(bp, dp, da);

    const productSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const product = await prisma.product.create({
      data: {
        name,
        slug: productSlug,
        description,
        nutritionInfo: nutritionInfo || null,
        categoryId: categoryId || null,
        basePrice: bp,
        discountPercent: dp,
        discountAmount: da,
        finalPrice,
        unit: unit || 'kg',
        minOrderQty: parseFloat(minOrderQty || 0.5),
        maxOrderQty: maxOrderQty ? parseFloat(maxOrderQty) : null,
        stockQty: parseFloat(stockQty || 0),
        lowStockThreshold: parseFloat(lowStockThreshold || 5),
        isAvailable: isAvailable !== false && isAvailable !== 'false',
        isFeatured: isFeatured === true || isFeatured === 'true',
        isBestSeller: isBestSeller === true || isBestSeller === 'true',
        isExclusive: isExclusive === true || isExclusive === 'true',
        exclusiveLabel: exclusiveLabel || null,
        isSeasonal: isSeasonal === true || isSeasonal === 'true',
        seasonStart: seasonStart ? new Date(seasonStart) : null,
        seasonEnd: seasonEnd ? new Date(seasonEnd) : null,
        origin: origin || null,
        harvestDate: harvestDate ? new Date(harvestDate) : null,
        shelfLife: shelfLife || null,
        tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t) => t.trim()) : []),
        sortOrder: parseInt(sortOrder || 0),
        fruitType: fruitType || null,
        variant: variant || null,
      },
      include: { images: true, category: true },
    });

    if (req.file) {
      const result = await uploadImage(req.file.path || req.file.buffer);
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: result.secure_url,
          publicId: result.public_id,
          altText: product.name,
          isPrimary: true,
          sortOrder: 0,
        },
      });
    }

    const withImages = await prisma.product.findUnique({
      where: { id: product.id },
      include: { images: true, category: true },
    });

    res.status(201).json(withImages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: 'Product not found' });

    const data = {};
    const fields = [
      'name', 'slug', 'description', 'nutritionInfo', 'categoryId', 'unit',
      'exclusiveLabel', 'origin', 'shelfLife', 'fruitType', 'variant',
    ];
    fields.forEach((f) => { if (req.body[f] !== undefined) data[f] = req.body[f]; });

    const boolFields = ['isAvailable', 'isFeatured', 'isBestSeller', 'isExclusive', 'isSeasonal'];
    boolFields.forEach((f) => {
      if (req.body[f] !== undefined) data[f] = req.body[f] === true || req.body[f] === 'true';
    });

    const floatFields = ['basePrice', 'discountPercent', 'discountAmount', 'minOrderQty', 'maxOrderQty', 'stockQty', 'lowStockThreshold'];
    floatFields.forEach((f) => {
      if (req.body[f] !== undefined) data[f] = parseFloat(req.body[f]);
    });
    if (data.stockQty !== undefined) data.stockQty = Math.max(0, data.stockQty);

    if (req.body.sortOrder !== undefined) data.sortOrder = parseInt(req.body.sortOrder);
    if (req.body.harvestDate) data.harvestDate = new Date(req.body.harvestDate);
    if (req.body.seasonStart) data.seasonStart = new Date(req.body.seasonStart);
    if (req.body.seasonEnd) data.seasonEnd = new Date(req.body.seasonEnd);
    if (req.body.tags) {
      data.tags = Array.isArray(req.body.tags) ? req.body.tags : req.body.tags.split(',').map((t) => t.trim());
    }

    // Recalculate finalPrice if pricing changed
    const bp = data.basePrice ?? existing.basePrice;
    const dp = data.discountPercent ?? existing.discountPercent;
    const da = data.discountAmount ?? existing.discountAmount;
    data.finalPrice = calculateFinalPrice(bp, dp, da);

    const updated = await prisma.product.update({
      where: { id },
      data,
      include: { images: true, category: true },
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const existing = await prisma.product.findUnique({ where: { id }, include: { images: true } });
    if (!existing) return res.status(404).json({ message: 'Product not found' });

    // Check if product is referenced in any orders
    const orderItemCount = await prisma.orderItem.count({ where: { productId: id } });
    if (orderItemCount > 0) {
      return res.status(409).json({
        message: 'Cannot delete product that has been ordered. This product is referenced in active orders.'
      });
    }

    // Delete images from Cloudinary
    for (const img of existing.images) {
      if (img.publicId) await destroyImage(img.publicId).catch(() => {});
    }

    await prisma.product.delete({ where: { id } });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function updateStock(req, res) {
  try {
    const { id } = req.params;
    const { stockQty } = req.body;
    if (stockQty == null) return res.status(400).json({ message: 'stockQty is required' });

    const parsed = parseFloat(stockQty);
    if (isNaN(parsed) || parsed < 0) {
      return res.status(400).json({ message: 'Stock quantity cannot be negative' });
    }

    const product = await prisma.product.update({
      where: { id },
      data: { stockQty: parsed },
      select: { id: true, name: true, stockQty: true, lowStockThreshold: true },
    });
    res.json({ data: product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function updateDiscount(req, res) {
  try {
    const { id } = req.params;
    const { discountPercent, discountAmount } = req.body;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: 'Product not found' });

    const dp = discountPercent != null ? parseFloat(discountPercent) : 0;
    const da = discountAmount != null ? parseFloat(discountAmount) : 0;
    const finalPrice = calculateFinalPrice(existing.basePrice, dp, da);

    const product = await prisma.product.update({
      where: { id },
      data: { discountPercent: dp, discountAmount: da, finalPrice },
    });
    res.json({ data: product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function updatePrice(req, res) {
  try {
    const { id } = req.params;
    const { basePrice } = req.body;
    if (basePrice == null) return res.status(400).json({ message: 'basePrice is required' });

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: 'Product not found' });

    const bp = parseFloat(basePrice);
    const finalPrice = calculateFinalPrice(bp, existing.discountPercent, existing.discountAmount);

    const product = await prisma.product.update({
      where: { id },
      data: { basePrice: bp, finalPrice },
    });
    res.json({ data: product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function toggleAvailable(req, res) {
  try {
    const { id } = req.params;
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: 'Product not found' });

    const product = await prisma.product.update({
      where: { id },
      data: { isAvailable: !existing.isAvailable },
      select: { id: true, name: true, isAvailable: true },
    });
    res.json({ data: product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function uploadProductImage(req, res) {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (!req.file) return res.status(400).json({ message: 'No image file provided' });

    const result = await uploadImage(req.file.path || req.file.buffer);
    const hasPrimary = await prisma.productImage.findFirst({ where: { productId: id, isPrimary: true } });

    const image = await prisma.productImage.create({
      data: {
        productId: id,
        url: result.secure_url,
        publicId: result.public_id,
        altText: product.name,
        isPrimary: !hasPrimary,
        sortOrder: 0,
      },
    });
    res.status(201).json({ data: image });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function deleteProductImage(req, res) {
  try {
    const { id, imageId } = req.params;
    const image = await prisma.productImage.findUnique({ where: { id: imageId } });
    if (!image || image.productId !== id) return res.status(404).json({ message: 'Image not found' });

    if (image.publicId) await destroyImage(image.publicId).catch(() => {});
    await prisma.productImage.delete({ where: { id: imageId } });

    res.json({ message: 'Image deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  listFruitTypes,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  updateDiscount,
  updatePrice,
  toggleAvailable,
  uploadProductImage,
  deleteProductImage,
};
