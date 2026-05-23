const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { createOrder, myOrders } = require('../controllers/order.controller');

router.post('/', authenticate, createOrder);
router.get('/my-orders', authenticate, myOrders);

module.exports = router;
