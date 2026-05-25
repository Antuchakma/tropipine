const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/role.middleware');
const {
  getRevenueAnalytics,
  getOrderStatusAnalytics,
  getTopProducts,
  getLowStockProducts,
} = require('../controllers/analytics.controller');

router.get('/revenue', authenticate, requireAdmin, getRevenueAnalytics);
router.get('/order-statuses', authenticate, requireAdmin, getOrderStatusAnalytics);
router.get('/top-products', authenticate, requireAdmin, getTopProducts);
router.get('/low-stock', authenticate, requireAdmin, getLowStockProducts);

module.exports = router;
