const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/role.middleware');
const { createCoupon, validateCoupon } = require('../controllers/coupon.controller');

router.post('/validate', validateCoupon);
router.post('/', authenticate, requireAdmin, createCoupon);

module.exports = router;
