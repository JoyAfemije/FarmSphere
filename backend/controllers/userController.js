const User = require("../models/User");
const { asyncHandler } = require("../middleware/errorHandler");

// @desc    Get all users (Admin)
// @route   GET /api/users
// @access  Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search } = req.query;
  const query = {};
  if (search) query.$or = [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }];

  const skip = (Number(page) - 1) * Number(limit);
  const [users, total] = await Promise.all([
    User.find(query).select("-password").sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    User.countDocuments(query),
  ]);

  res.json({
    success: true,
    users,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
  });
});

// @desc    Get user by ID (Admin)
// @route   GET /api/users/:id
// @access  Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ success: false, message: "User not found." });
  res.json({ success: true, user });
});

// @desc    Update user role or status (Admin)
// @route   PUT /api/users/:id
// @access  Admin
const updateUser = asyncHandler(async (req, res) => {
  const { role, isActive } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role, isActive },
    { new: true, runValidators: true }
  ).select("-password");

  if (!user) return res.status(404).json({ success: false, message: "User not found." });
  res.json({ success: true, message: "User updated.", user });
});

// @desc    Delete user (Admin)
// @route   DELETE /api/users/:id
// @access  Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: "User not found." });
  res.json({ success: true, message: "User deleted." });
});

// @desc    Send contact form (Public)
// @route   POST /api/users/contact
// @access  Public
const sendContact = asyncHandler(async (req, res) => {
  const { sendContactNotification } = require("../utils/sendEmail");
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "Name, email and message are required." });
  }

  await sendContactNotification({ name, email, phone, subject, message });
  res.json({ success: true, message: "Message sent successfully! We'll get back to you soon." });
});

module.exports = { getAllUsers, getUserById, updateUser, deleteUser, sendContact };
