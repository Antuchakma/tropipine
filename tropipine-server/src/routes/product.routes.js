const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload.middleware');
const { authenticate } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/role.middleware');
const {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  updateDiscount,
  updatePrice,
  toggleAvailable,
  uploadProductImage,
  deleteProductImage,
} = require('../controllers/product.controller');

// Public routes
router.get('/', listProducts);
router.get('/:id', getProduct);

// Admin routes
router.post('/', authenticate, requireAdmin, upload.single('image'), createProduct);
router.patch('/:id', authenticate, requireAdmin, upload.single('image'), updateProduct);
router.patch('/:id/stock', authenticate, requireAdmin, updateStock);
router.patch('/:id/discount', authenticate, requireAdmin, updateDiscount);
router.patch('/:id/price', authenticate, requireAdmin, updatePrice);
router.patch('/:id/toggle-available', authenticate, requireAdmin, toggleAvailable);
router.post('/:id/images', authenticate, requireAdmin, upload.single('image'), uploadProductImage);
router.delete('/:id/images/:imageId', authenticate, requireAdmin, deleteProductImage);
router.delete('/:id', authenticate, requireAdmin, deleteProduct);

module.exports = router;
