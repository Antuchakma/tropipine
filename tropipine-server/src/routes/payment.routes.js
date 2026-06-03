const express = require('express');
const router = express.Router();
const { authenticate, optionalAuthenticate } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/role.middleware');
const { submitPayment, verifyPayment, rejectPayment, getPaymentConfig, updatePaymentConfig, getAllPayments } = require('../controllers/payment.controller');

router.post('/submit', optionalAuthenticate, submitPayment);
router.get('/config', getPaymentConfig);
router.patch('/config', authenticate, requireAdmin, updatePaymentConfig);
router.get('/', authenticate, requireAdmin, getAllPayments);
router.patch('/:id/verify', authenticate, requireAdmin, verifyPayment);
router.patch('/:id/reject', authenticate, requireAdmin, rejectPayment);

module.exports = router;
