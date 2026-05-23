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

module.exports = { createCoupon, validateCoupon };
