const Order = require("../models/Order");
const Product = require("../models/Product");
const { asyncHandler } = require("../middleware/errorHandler");
const { sendOrderConfirmation } = require("../utils/sendEmail");

// @desc    Create new order
// @route   POST /api/orders
// @access  Public (guests supported)
const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod, notes } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ success: false, message: "Order must have at least one item." });
  }

  // Validate stock and calculate subtotal
  let subtotal = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product || !product.isActive) {
      return res.status(400).json({ success: false, message: `Product ${item.product} not available.` });
    }
    if (product.stock < item.quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
      });
    }

    const effectivePrice = product.discountPrice || product.price;
    subtotal += effectivePrice * item.quantity;

    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.images?.[0]?.url || "",
      price: effectivePrice,
      quantity: item.quantity,
    });

    // Decrement stock
    await Product.findByIdAndUpdate(product._id, {
      $inc: { stock: -item.quantity, sold: item.quantity },
    });
  }

  // Simple shipping: free above $20
  const shippingFee = subtotal >= 20000 ? 0 : 1500;
  const total = subtotal + shippingFee;

  const orderData = {
    items: orderItems,
    shippingAddress,
    paymentMethod: paymentMethod || "whatsapp",
    subtotal,
    shippingFee,
    total,
    notes,
  };

  // Attach authenticated user or guest info
  if (req.user) {
    orderData.user = req.user._id;
  } else if (req.body.guestInfo) {
    orderData.guestInfo = req.body.guestInfo;
  }

  const order = await Order.create(orderData);

  // Send confirmation email
  const emailAddr = shippingAddress.email || req.user?.email || req.body.guestInfo?.email;
  if (emailAddr) {
    sendOrderConfirmation(order, emailAddr).catch(console.error);
  }

  res.status(201).json({ success: true, message: "Order placed successfully!", order });
});

// @desc    Get logged-in user's orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .populate("items.product", "name images");

  res.json({ success: true, orders });
});

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private (owner or admin)
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("items.product", "name images");

  if (!order) return res.status(404).json({ success: false, message: "Order not found." });

  // Only owner or admin can view
  if (req.user.role !== "admin" && order.user?._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: "Access denied." });
  }

  res.json({ success: true, order });
});

// ─── Admin ─────────────────────────────────────────────────────────────────

// @desc    Get all orders (Admin)
// @route   GET /api/orders/admin
// @access  Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const query = {};
  if (status) query.orderStatus = status;

  const skip = (Number(page) - 1) * Number(limit);
  const [orders, total] = await Promise.all([
    Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate("user", "name email"),
    Order.countDocuments(query),
  ]);

  res.json({
    success: true,
    orders,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
  });
});

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus, paymentStatus, trackingNumber } = req.body;

  const updates = {};
  if (orderStatus) updates.orderStatus = orderStatus;
  if (paymentStatus) updates.paymentStatus = paymentStatus;
  if (trackingNumber) updates.trackingNumber = trackingNumber;
  if (orderStatus === "delivered") updates.deliveredAt = new Date();
  if (orderStatus === "cancelled") {
    updates.cancelledAt = new Date();
    updates.cancelReason = req.body.cancelReason || "";
  }

  const order = await Order.findByIdAndUpdate(req.params.id, updates, { new: true });
  if (!order) return res.status(404).json({ success: false, message: "Order not found." });

  res.json({ success: true, message: "Order status updated.", order });
});

// @desc    Get dashboard summary stats (Admin)
// @route   GET /api/orders/admin/stats
// @access  Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalOrders, totalRevenue, pendingOrders, deliveredOrders] = await Promise.all([
    Order.countDocuments(),
    Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]),
    Order.countDocuments({ orderStatus: "pending" }),
    Order.countDocuments({ orderStatus: "delivered" }),
  ]);

  // Monthly revenue for chart (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyRevenue = await Order.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo }, paymentStatus: "paid" } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        revenue: { $sum: "$total" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  res.json({
    success: true,
    stats: {
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      pendingOrders,
      deliveredOrders,
      monthlyRevenue,
    },
  });
});

module.exports = { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus, getDashboardStats };
