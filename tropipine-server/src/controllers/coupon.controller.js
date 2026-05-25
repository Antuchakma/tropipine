const { prisma } = require('../config/db');

async function createCoupon(req, res) {
  try {
    const { code, type, value, minOrderAmount } = req.body;
    if (!code || !type || value == null) return res.status(400).json({ message: 'Missing fields' });

    const coupon = await prisma.coupon.create({ data: { code, type, value: parseFloat(value), minOrderAmount: parseFloat(minOrderAmount || 0), isActive: true } });
    res.status(201).json({ coupon });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function validateCoupon(req, res) {
  try {
    const { code, cartTotal } = req.body;
    if (!code) return res.status(400).json({ message: 'Missing code' });

    const coupon = await prisma.coupon.findUnique({ where: { code } });
    if (!coupon || !coupon.isActive) return res.status(404).json({ valid: false, message: 'Invalid coupon' });
    if (parseFloat(cartTotal || 0) < coupon.minOrderAmount) return res.status(400).json({ valid: false, message: 'Minimum amount not met' });

    let discount = 0;
    if (coupon.type === 'PERCENTAGE') discount = (parseFloat(cartTotal) * coupon.value) / 100;
    else discount = coupon.value;

    res.json({ valid: true, discount, coupon });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function getAllCoupons(req, res) {
  try {
    const { isActive, page = 1, limit = 20 } = req.query;
    const where = {};
    if (isActive !== undefined) where.isActive = isActive === 'true';

    const coupons = await prisma.coupon.findMany({
      where,
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.coupon.count({ where });

    res.json({ data: coupons, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function updateCoupon(req, res) {
  try {
    const { id } = req.params;
    const { code, type, value, minOrderAmount, maxDiscount, usageLimit, perUserLimit } = req.body;

    const data = {};
    if (code) data.code = code;
    if (type) data.type = type;
    if (value !== undefined) data.value = parseFloat(value);
    if (minOrderAmount !== undefined) data.minOrderAmount = parseFloat(minOrderAmount);
    if (maxDiscount !== undefined) data.maxDiscount = parseFloat(maxDiscount);
    if (usageLimit !== undefined) data.usageLimit = parseInt(usageLimit);
    if (perUserLimit !== undefined) data.perUserLimit = parseInt(perUserLimit);

    const coupon = await prisma.coupon.update({
      where: { id },
      data,
    });

    res.json({ data: coupon });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function deleteCoupon(req, res) {
  try {
    const { id } = req.params;
    await prisma.coupon.delete({ where: { id } });
    res.json({ message: 'Coupon deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function toggleCoupon(req, res) {
  try {
    const { id } = req.params;
    const coupon = await prisma.coupon.findUnique({ where: { id } });

    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });

    const updated = await prisma.coupon.update({
      where: { id },
      data: { isActive: !coupon.isActive },
    });

    res.json({ data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { createCoupon, validateCoupon, getAllCoupons, updateCoupon, deleteCoupon, toggleCoupon };
