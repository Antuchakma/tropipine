const fs = require('fs');
const { prisma } = require('../config/db');
const { uploadImage, destroyImage } = require('../services/cloudinary.service');

async function listProducts(req, res) {
  const page = parseInt(req.query.page || '1', 10);
  const limit = parseInt(req.query.limit || '12', 10);
  const skip = (page - 1) * limit;
  const featured = req.query.featured === 'true';
  
  try {
    const where = featured ? { isFeatured: true } : {};
    
    const [items, total] = await Promise.all([
      prisma.product.findMany({ 
        skip, 
        take: limit,
        where,
        include: {
          images: true,
          category: true,
        }
      }),
      prisma.product.count({ where }),
    ]);
    res.json({ items, total, page, limit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function getProduct(req, res) {
  try {
    const id = req.params.id;
    const product = await prisma.product.findUnique({ 
      where: { id },
      include: {
        images: true,
        category: true,
        reviews: true,
      }
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function createProduct(req, res) {
  try {
    const { name, slug, description, categoryId, basePrice, finalPrice, stockQty, origin, isFeatured, isExclusive, exclusiveLabel } = req.body;

    const product = await prisma.product.create({ 
      data: { 
        name, 
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        description, 
        categoryId: categoryId || null,
        basePrice: parseFloat(basePrice || 0),
        finalPrice: parseFloat(finalPrice || basePrice || 0),
        stockQty: parseInt(stockQty || '0', 10),
        origin: origin || '',
        isFeatured: isFeatured === true || isFeatured === 'true',
        isExclusive: isExclusive === true || isExclusive === 'true',
        exclusiveLabel: exclusiveLabel || '',
      },
      include: {
        images: true,
        category: true,
      }
    });
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function updateProduct(req, res) {
  try {
    const id = req.params.id;
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: 'Not found' });

    const data = {};
    if (req.body.name) data.name = req.body.name;
    if (req.body.slug) data.slug = req.body.slug;
    if (req.body.description) data.description = req.body.description;
    if (req.body.categoryId) data.categoryId = req.body.categoryId;
    if (req.body.basePrice !== undefined) data.basePrice = parseFloat(req.body.basePrice);
    if (req.body.finalPrice !== undefined) data.finalPrice = parseFloat(req.body.finalPrice);
    if (req.body.stockQty !== undefined) data.stockQty = parseInt(req.body.stockQty, 10);
    if (req.body.origin) data.origin = req.body.origin;
    if (req.body.isFeatured !== undefined) data.isFeatured = req.body.isFeatured === true || req.body.isFeatured === 'true';
    if (req.body.isExclusive !== undefined) data.isExclusive = req.body.isExclusive === true || req.body.isExclusive === 'true';
    if (req.body.exclusiveLabel) data.exclusiveLabel = req.body.exclusiveLabel;

    const updated = await prisma.product.update({ 
      where: { id }, 
      data,
      include: {
        images: true,
        category: true,
      }
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function deleteProduct(req, res) {
  try {
    const id = req.params.id;
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: 'Product not found' });
    await prisma.product.delete({ where: { id } });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

module.exports = { listProducts, getProduct, createProduct, updateProduct, deleteProduct };
