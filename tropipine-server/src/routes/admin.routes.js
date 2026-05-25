const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { requireAdmin, requireSuperAdmin } = require('../middleware/role.middleware');
const { overview, listUsers, getUserById, toggleUserActive, changeUserRole, listOrders } = require('../controllers/admin.controller');

router.get('/overview', authenticate, requireAdmin, overview);
router.get('/users', authenticate, requireAdmin, listUsers);
router.get('/users/:id', authenticate, requireAdmin, getUserById);
router.patch('/users/:id/toggle-active', authenticate, requireAdmin, toggleUserActive);
router.patch('/users/:id/role', authenticate, requireSuperAdmin, changeUserRole);
router.get('/orders', authenticate, requireAdmin, listOrders);

module.exports = router;
