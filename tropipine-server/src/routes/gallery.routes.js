const express = require('express');
const { getGalleryImages, createGalleryImage, updateGalleryImage, deleteGalleryImage } = require('../controllers/gallery.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/role.middleware');
const upload = require('../middleware/upload.middleware');

const router = express.Router();

// Public routes
router.get('/', getGalleryImages);

// Admin routes (protected)
router.post('/', authenticate, requireAdmin, upload.single('image'), createGalleryImage);
router.patch('/:id', authenticate, requireAdmin, updateGalleryImage);
router.delete('/:id', authenticate, requireAdmin, deleteGalleryImage);

module.exports = router;
