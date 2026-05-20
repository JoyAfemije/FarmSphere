const multer = require("multer");
const { storage } = require("../config/cloudinary");

// File filter — only accept images
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, and WebP images are allowed"), false);
  }
};

// Multer upload instance configured with Cloudinary storage
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max per file
    files: 5,                   // Max 5 images per product
  },
});

module.exports = upload;
