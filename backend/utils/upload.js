const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary from env variables
// Requires CLOUDINARY_URL format: cloudinary://API_KEY:API_SECRET@CLOUD_NAME
if (process.env.CLOUDINARY_URL) {
  // It auto-configures if CLOUDINARY_URL is present, but we can also explicitly set it if needed
  // cloudinary.config({ ... })
}

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'campustrade_items',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }]
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

module.exports = upload;
