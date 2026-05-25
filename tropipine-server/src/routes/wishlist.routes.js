const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { getWishlist, addToWishlist, removeFromWishlist } = require('../controllers/wishlist.controller');

router.get('/', authenticate, getWishlist);
router.post('/:productId', authenticate, addToWishlist);
router.delete('/:productId', authenticate, removeFromWishlist);

module.exports = router;
