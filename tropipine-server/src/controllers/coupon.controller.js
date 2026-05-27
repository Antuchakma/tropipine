const { prisma } = require('../config/db');

async function createCoupon(req, res) {
  try {
    const { code, type, value, minOrderAmount, maxDiscount, usageLimit, perUserLimit, expiresAt } = req.body;
    if (!code || !type || value == null) {
      return res.status(400).json({ message: 'code, type, and value are required' });
    }
    if (!['PERCENTAGE', 'FIXED'].includes(type)) {
      return res.status(400).json({ message: 'type must be PERCENTAGE or FIXED' });
    }

    const data = {
      code: code.trim().toUpperCase(),
      type,
      value: parseFloat(value),
      minOrderAmount: parseFloat(minOrderAmount || 0),
      isActive: true,
    };
    if (maxDiscount != null) data.maxDiscount = parseFloat(maxDiscount);
    if (usageLimit != null) data.usageLimit = parseInt(usageLimit);
    if (perUserLimit != null) data.perUserLimit = parseInt(perUserLimit);
    if (expiresAt) data.expiresAt = new Date(expiresAt);

    const coupon = await prisma.coupon.create({ data });
    res.status(201).json({ coupon });
  } catch (err) {
    console.error(err);
    if (err.code === 'P2002') return res.status(409).json({ message: 'Coupon code already exists' });
    res.status(500).json({ message: 'Server error' });
  }
}

async function validateCoupon(req, res) {
  try {
    const { code, cartTotal } = req.body;
    if (!code) return res.status(400).json({ valid: false, message: 'Coupon code is required' });

    const normalizedCode = code.trim().toUpperCase();
    const coupon = await prisma.coupon.findUnique({ where: { code: normalizedCode } });

    if (!coupon || !coupon.isActive) {
      return res.status(404).json({ valid: false, message: 'Invalid coupon code' });
    }

    // Check expiry
    if (coupon.expiresAt && new Date() > new Date(coupon.expiresAt)) {
      return res.status(400).json({ valid: false, message: 'This coupon has expired' });
    }

    // Check global usage limit
    if (coupon.usageLimit != null && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ valid: false, message: 'This coupon has reached its usage limit' });
    }

    // Check minimum order amount
    const total = parseFloat(cartTotal || 0);
    if (total < coupon.minOrderAmount) {
      return res.status(400).json({
        valid: false,
        message: `Minimum order amount of ${coupon.minOrderAmount} required for this coupon`,
      });
    }

    // Per-user limit check (only when user is authenticated)
    if (coupon.perUserLimit && req.user) {
      const userUsageCount = await prisma.order.count({
        where: { userId: req.user.id, couponId: coupon.id },
      });
      if (userUsageCount >= coupon.perUserLimit) {
        return res.status(400).json({
          valid: false,
          message: `You can only use this coupon ${coupon.perUserLimit} time(s)`,
        });
      }
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (coupon.type === 'PERCENTAGE') {
      discountAmount = (total * coupon.value) / 100;
      if (coupon.maxDiscount != null && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = Math.min(coupon.value, total);
    }
    discountAmount = parseFloat(discountAmount.toFixed(2));

    res.json({
      valid: true,
      discountAmount,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        maxDiscount: coupon.maxDiscount,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ valid: false, message: 'Server error' });
  }
}

async function getAllCoupons(req, res) {
  try {
    const { isActive, page = 1, limit = 20 } = req.query;
    const where = {};
    if (isActive !== undefined) where.isActive = isActive === 'true';

    const [coupons, total] = await Promise.all([
      prisma.coupon.findMany({
        where,
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.coupon.count({ where }),
    ]);

    res.json({ data: coupons, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function updateCoupon(req, res) {
  try {
    const { id } = req.params;
    const { code, type, value, minOrderAmount, maxDiscount, usageLimit, perUserLimit, expiresAt, isActive } = req.body;

    const data = {};
    if (code) data.code = code.trim().toUpperCase();
    if (type) data.type = type;
    if (value !== undefined) data.value = parseFloat(value);
    if (minOrderAmount !== undefined) data.minOrderAmount = parseFloat(minOrderAmount);
    if (maxDiscount !== undefined) data.maxDiscount = maxDiscount != null ? parseFloat(maxDiscount) : null;
    if (usageLimit !== undefined) data.usageLimit = usageLimit != null ? parseInt(usageLimit) : null;
    if (perUserLimit !== undefined) data.perUserLimit = parseInt(perUserLimit);
    if (expiresAt !== undefined) data.expiresAt = expiresAt ? new Date(expiresAt) : null;
    if (isActive !== undefined) data.isActive = isActive === true || isActive === 'true';

    const coupon = await prisma.coupon.update({ where: { id }, data });
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
