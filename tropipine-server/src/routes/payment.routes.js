const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/role.middleware');
const { submitPayment, verifyPayment, rejectPayment } = require('../controllers/payment.controller');

router.post('/submit', authenticate, submitPayment);
router.patch('/:id/verify', authenticate, requireAdmin, verifyPayment);
router.patch('/:id/reject', authenticate, requireAdmin, rejectPayment);

module.exports = router;
