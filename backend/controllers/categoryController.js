const Category = require("../models/Category");
const Product = require("../models/Product");
const { asyncHandler } = require("../middleware/errorHandler");

// @desc    Get all active categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ order: 1, name: 1 });

  // Attach product count for each category
  const withCounts = await Promise.all(
    categories.map(async (cat) => {
      const count = await Product.countDocuments({ category: cat._id, isActive: true });
      return { ...cat.toObject(), productCount: count };
    })
  );

  res.json({ success: true, categories: withCounts });
});

// @desc    Get single category by slug
// @route   GET /api/categories/:slug
// @access  Public
const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug, isActive: true });
  if (!category) return res.status(404).json({ success: false, message: "Category not found." });
  res.json({ success: true, category });
});

// @desc    Create category (Admin)
// @route   POST /api/categories
// @access  Admin
const createCategory = asyncHandler(async (req, res) => {
  const { name, description, icon, order } = req.body;
  const image = req.file ? req.file.path : "";
  const category = await Category.create({ name, description, icon, order, image });
  res.status(201).json({ success: true, message: "Category created.", category });
});

// @desc    Update category (Admin)
// @route   PUT /api/categories/:id
// @access  Admin
const updateCategory = asyncHandler(async (req, res) => {
  const updates = { ...req.body };
  if (req.file) updates.image = req.file.path;

  const category = await Category.findByIdAndUpdate(req.params.id, updates, {
    new: true, runValidators: true,
  });
  if (!category) return res.status(404).json({ success: false, message: "Category not found." });

  res.json({ success: true, message: "Category updated.", category });
});

// @desc    Delete category (Admin) — soft delete
// @route   DELETE /api/categories/:id
// @access  Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id, { isActive: false }, { new: true }
  );
  if (!category) return res.status(404).json({ success: false, message: "Category not found." });
  res.json({ success: true, message: "Category deleted." });
});

module.exports = { getCategories, getCategoryBySlug, createCategory, updateCategory, deleteCategory };
