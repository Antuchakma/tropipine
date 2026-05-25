const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/role.middleware');
const { getProductReviews, submitReview, getAllReviews, approveReview, deleteReview } = require('../controllers/review.controller');

router.get('/product/:productId', getProductReviews);
router.post('/', authenticate, submitReview);
router.get('/', authenticate, requireAdmin, getAllReviews);
router.patch('/:id/approve', authenticate, requireAdmin, approveReview);
router.delete('/:id', authenticate, requireAdmin, deleteReview);

module.exports = router;
