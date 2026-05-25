const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/role.middleware');
const {
  createOrder,
  myOrders,
  getMyOrderById,
  cancelOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} = require('../controllers/order.controller');

router.post('/', authenticate, createOrder);
router.get('/my-orders', authenticate, myOrders);
router.get('/my-orders/:id', authenticate, getMyOrderById);
router.patch('/my-orders/:id/cancel', authenticate, cancelOrder);
router.get('/', authenticate, requireAdmin, getAllOrders);
router.get('/:id', authenticate, requireAdmin, getOrderById);
router.patch('/:id/status', authenticate, requireAdmin, updateOrderStatus);

module.exports = router;
