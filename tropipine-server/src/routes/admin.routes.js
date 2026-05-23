const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/role.middleware');
const { overview, listUsers, listOrders } = require('../controllers/admin.controller');

router.get('/overview', authenticate, requireAdmin, overview);
router.get('/users', authenticate, requireAdmin, listUsers);
router.get('/orders', authenticate, requireAdmin, listOrders);

module.exports = router;
