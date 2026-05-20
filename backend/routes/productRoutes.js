const express = require("express");
const router = express.Router();
const {
  getProducts, getProductBySlug, getRelatedProducts,
  createProduct, updateProduct, deleteProduct, deleteProductImage, getAdminProducts,
} = require("../controllers/productController");
const { protect, adminOnly } = require("../middleware/auth");
const upload = require("../middleware/upload");

// Public
router.get("/", getProducts);
router.get("/admin/all", protect, adminOnly, getAdminProducts);
router.get("/:slug", getProductBySlug);
router.get("/:id/related", getRelatedProducts);

// Admin
router.post("/", protect, adminOnly, upload.array("images", 5), createProduct);
router.put("/:id", protect, adminOnly, upload.array("images", 5), updateProduct);
router.delete("/:id/image", protect, adminOnly, deleteProductImage);
router.delete("/:id", protect, adminOnly, deleteProduct);

module.exports = router;
