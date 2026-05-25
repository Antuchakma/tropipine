const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/role.middleware');
const { createCoupon, validateCoupon, getAllCoupons, updateCoupon, deleteCoupon, toggleCoupon } = require('../controllers/coupon.controller');

router.post('/validate', validateCoupon);
router.get('/', authenticate, requireAdmin, getAllCoupons);
router.post('/', authenticate, requireAdmin, createCoupon);
router.patch('/:id', authenticate, requireAdmin, updateCoupon);
router.patch('/:id/toggle', authenticate, requireAdmin, toggleCoupon);
router.delete('/:id', authenticate, requireAdmin, deleteCoupon);

module.exports = router;
