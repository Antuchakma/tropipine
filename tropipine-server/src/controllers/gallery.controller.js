const { prisma } = require('../config/db');

async function getGalleryImages(req, res) {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    res.json({ data: images });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function createGalleryImage(req, res) {
  try {
    const { caption, category } = req.body || {};
    
    let url = null;
    let publicId = null;

    // Handle file upload if provided
    if (req.file) {
      url = `/uploads/gallery/${req.file.filename}`;
      publicId = req.file.filename;
    } else if (req.body?.url) {
      url = req.body.url;
      publicId = req.body.publicId || `gallery_${Date.now()}`;
    }

    if (!url) {
      return res.status(400).json({ message: 'File or URL is required' });
    }

    const image = await prisma.galleryImage.create({
      data: {
        url,
        publicId,
        caption: caption || '',
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
    const id = req.params.id;
    const { caption, sortOrder } = req.body;

    const data = {};
    if (caption !== undefined) data.caption = caption;
    if (sortOrder !== undefined) data.sortOrder = sortOrder;

    const image = await prisma.galleryImage.update({
      where: { id },
      data,
    });

    res.json({ data: image });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function deleteGalleryImage(req, res) {
  try {
    const id = req.params.id;
    const existing = await prisma.galleryImage.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: 'Image not found' });

    await prisma.galleryImage.delete({ where: { id } });
    res.json({ message: 'Image deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

module.exports = { getGalleryImages, createGalleryImage, updateGalleryImage, deleteGalleryImage };
