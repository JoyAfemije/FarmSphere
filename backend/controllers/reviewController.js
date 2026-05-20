const Review = require("../models/Review");
const Order = require("../models/Order");
const { asyncHandler } = require("../middleware/errorHandler");

// @desc    Get all reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
const getProductReviews = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const [reviews, total] = await Promise.all([
    Review.find({ product: req.params.productId })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Review.countDocuments({ product: req.params.productId }),
  ]);

  res.json({
    success: true,
    reviews,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
  });
});

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const { product, rating, title, comment } = req.body;

  // Check if user already reviewed this product
  const existing = await Review.findOne({ product, user: req.user._id });
  if (existing) {
    return res.status(400).json({ success: false, message: "You already reviewed this product." });
  }

  // Check if user has purchased the product (verified purchase)
  const hasPurchased = await Order.exists({
    user: req.user._id,
    "items.product": product,
    orderStatus: "delivered",
  });

  const review = await Review.create({
    product,
    user: req.user._id,
    rating,
    title,
    comment,
    isVerifiedPurchase: !!hasPurchased,
  });

  await review.populate("user", "name avatar");
  res.status(201).json({ success: true, message: "Review submitted.", review });
});

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private (owner only)
const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ success: false, message: "Review not found." });
  if (review.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: "Not authorized to edit this review." });
  }

  const { rating, title, comment } = req.body;
  review.rating = rating ?? review.rating;
  review.title = title ?? review.title;
  review.comment = comment ?? review.comment;
  await review.save();

  res.json({ success: true, message: "Review updated.", review });
});

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private (owner or admin)
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ success: false, message: "Review not found." });

  const isOwner = review.user.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Not authorized." });
  }

  await review.remove();
  res.json({ success: true, message: "Review deleted." });
});

module.exports = { getProductReviews, createReview, updateReview, deleteReview };
