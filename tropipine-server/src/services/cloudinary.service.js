const cloudinary = require('cloudinary').v2;
require('dotenv/config');
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImage(filePath, folder = 'tropipine') {
  const res = await cloudinary.uploader.upload(filePath, { folder });
  return { url: res.secure_url, public_id: res.public_id };
}

async function destroyImage(publicId) {
  if (!publicId) return;
  return cloudinary.uploader.destroy(publicId);
}

module.exports = { uploadImage, destroyImage };
