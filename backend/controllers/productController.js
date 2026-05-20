const Product = require("../models/Product");
const { cloudinary } = require("../config/cloudinary");
const { asyncHandler } = require("../middleware/errorHandler");

// ─── Public Routes ────────────────────────────────────────────────────────────

// @desc    Get all products with filtering, sorting, search, pagination
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 12,
    category,
    search,
    sort = "-createdAt",
    minPrice,
    maxPrice,
    featured,
    brand,
  } = req.query;

  const query = { isActive: true };

  // Category filter
  if (category) query.category = category;

  // Price range filter
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // Featured filter
  if (featured === "true") query.isFeatured = true;

  // Brand filter
  if (brand) query.brand = { $regex: brand, $options: "i" };

  // Full-text search
  if (search) {
    query.$text = { $search: search };
  }

  // Sort options
  const sortMap = {
    "-createdAt": { createdAt: -1 },
    "createdAt": { createdAt: 1 },
    "price_asc": { price: 1 },
    "price_desc": { price: -1 },
    "-rating": { rating: -1 },
    "-sold": { sold: -1 },
  };
  const sortObj = sortMap[sort] || { createdAt: -1 };

  const skip = (Number(page) - 1) * Number(limit);

  const [products, total] = await Promise.all([
    Product.find(query)
      .populate("category", "name slug icon")
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Product.countDocuments(query),
  ]);

  res.json({
    success: true,
    products,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

// @desc    Get single product by slug
// @route   GET /api/products/:slug
// @access  Public
const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true }).populate(
    "category",
    "name slug"
  );

  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found." });
  }

  res.json({ success: true, product });
});

// @desc    Get related products (same category, exclude current)
// @route   GET /api/products/:id/related
// @access  Public
const getRelatedProducts = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ success: false, message: "Product not found." });

  const related = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
    isActive: true,
  })
    .limit(6)
    .populate("category", "name slug")
    .lean();

  res.json({ success: true, products: related });
});

// ─── Admin Routes ─────────────────────────────────────────────────────────────

// @desc    Create product (Admin)
// @route   POST /api/products
// @access  Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    name, description, shortDescription, price, discountPrice,
    category, stock, unit, sku, brand, tags, specifications,
    isFeatured, weight, dimensions, metaTitle, metaDescription,
  } = req.body;

  // Collect uploaded image URLs from Cloudinary (via Multer)
  const images = req.files
    ? req.files.map((file) => ({
        url: file.path,
        publicId: file.filename,
        alt: name,
      }))
    : [];

  const product = await Product.create({
    name, description, shortDescription, price, discountPrice,
    category, stock, unit, sku, brand, images,
    tags: tags ? (Array.isArray(tags) ? tags : tags.split(",").map((t) => t.trim())) : [],
    specifications: specifications ? JSON.parse(specifications) : [],
    isFeatured: isFeatured === "true",
    weight, dimensions: dimensions ? JSON.parse(dimensions) : undefined,
    metaTitle, metaDescription,
  });

  const populated = await product.populate("category", "name slug");
  res.status(201).json({ success: true, message: "Product created.", product: populated });
});

// @desc    Update product (Admin)
// @route   PUT /api/products/:id
// @access  Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ success: false, message: "Product not found." });

  const updates = { ...req.body };

  // Parse JSON strings from multipart form data
  if (updates.specifications) updates.specifications = JSON.parse(updates.specifications);
  if (updates.dimensions) updates.dimensions = JSON.parse(updates.dimensions);
  if (updates.tags && typeof updates.tags === "string")
    updates.tags = updates.tags.split(",").map((t) => t.trim());
  if (updates.isFeatured) updates.isFeatured = updates.isFeatured === "true";

  // Append new images if uploaded
  if (req.files && req.files.length > 0) {
    const newImages = req.files.map((file) => ({
      url: file.path,
      publicId: file.filename,
      alt: product.name,
    }));
    updates.images = [...(product.images || []), ...newImages];
  }

  const updated = await Product.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  }).populate("category", "name slug");

  res.json({ success: true, message: "Product updated.", product: updated });
});

// @desc    Delete product image (Admin)
// @route   DELETE /api/products/:id/image
// @access  Admin
const deleteProductImage = asyncHandler(async (req, res) => {
  const { publicId } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ success: false, message: "Product not found." });

  // Delete from Cloudinary
  await cloudinary.uploader.destroy(publicId);

  product.images = product.images.filter((img) => img.publicId !== publicId);
  await product.save();

  res.json({ success: true, message: "Image deleted.", images: product.images });
});

// @desc    Delete product (Admin) — soft delete
// @route   DELETE /api/products/:id
// @access  Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );
  if (!product) return res.status(404).json({ success: false, message: "Product not found." });

  res.json({ success: true, message: "Product deleted." });
});

// @desc    Get all products for admin (including inactive)
// @route   GET /api/products/admin/all
// @access  Admin
const getAdminProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search } = req.query;
  const query = {};
  if (search) query.$text = { $search: search };

  const skip = (Number(page) - 1) * Number(limit);
  const [products, total] = await Promise.all([
    Product.find(query)
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Product.countDocuments(query),
  ]);

  res.json({
    success: true,
    products,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
  });
});

module.exports = {
  getProducts, getProductBySlug, getRelatedProducts,
  createProduct, updateProduct, deleteProduct, deleteProductImage, getAdminProducts,
};
