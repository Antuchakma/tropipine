const { prisma } = require('../config/db');
const { uploadImage, destroyImage } = require('../services/cloudinary.service');

async function getGalleryImages(req, res) {
  try {
    const { category } = req.query;
    const where = {};
    if (category) where.category = category;

    const images = await prisma.galleryImage.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });
    res.json({ data: images });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function createGalleryImage(req, res) {
  try {
    const { caption, category } = req.body || {};

    let url = null;
    let publicId = null;

    if (req.file) {
      // Upload to Cloudinary
      const result = await uploadImage(req.file.path, 'tropipine/gallery');
      url = result.url;
      publicId = result.public_id;
    } else if (req.body?.url) {
      url = req.body.url;
      publicId = req.body.publicId || `gallery_${Date.now()}`;
    }

    if (!url) return res.status(400).json({ message: 'File or URL is required' });

    const image = await prisma.galleryImage.create({
      data: {
        url,
        publicId,
        caption: caption || null,
        category: category || 'FARM',
      },
    });

    res.status(201).json({ data: image });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function updateGalleryImage(req, res) {
  try {
    const { id } = req.params;
    const { caption, sortOrder } = req.body;

    const data = {};
    if (caption !== undefined) data.caption = caption;
    if (sortOrder !== undefined) data.sortOrder = parseInt(sortOrder);

    const image = await prisma.galleryImage.update({ where: { id }, data });
    res.json({ data: image });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function deleteGalleryImage(req, res) {
  try {
    const { id } = req.params;
    const existing = await prisma.galleryImage.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: 'Image not found' });

    // Delete from Cloudinary
    if (existing.publicId) await destroyImage(existing.publicId).catch(() => {});

    await prisma.galleryImage.delete({ where: { id } });
    res.json({ message: 'Image deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { getGalleryImages, createGalleryImage, updateGalleryImage, deleteGalleryImage };
