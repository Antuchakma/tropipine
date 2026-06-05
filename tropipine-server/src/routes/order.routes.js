const express = require('express');
const router = express.Router();
const { authenticate, optionalAuthenticate } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/role.middleware');
const {
  createOrder,
  myOrders,
  getMyOrderById,
  cancelOrder,
  cancelGuestOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  trackOrder,
  getRecentPendingCount,
  adminCreateOrder,
} = require('../controllers/order.controller');

router.get('/track', trackOrder);
router.get('/notifications', authenticate, requireAdmin, getRecentPendingCount);
router.post('/admin-create', authenticate, requireAdmin, adminCreateOrder);
router.post('/', optionalAuthenticate, createOrder);
router.post('/guest-cancel', cancelGuestOrder);
router.get('/my-orders', authenticate, myOrders);
router.get('/my-orders/:id', authenticate, getMyOrderById);
router.patch('/my-orders/:id/cancel', authenticate, cancelOrder);
router.get('/', authenticate, requireAdmin, getAllOrders);
router.get('/:id', authenticate, requireAdmin, getOrderById);
router.patch('/:id/status', authenticate, requireAdmin, updateOrderStatus);

module.exports = router;
