const express = require("express");
const router = express.Router();
const {
  createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus, getDashboardStats,
} = require("../controllers/orderController");
const { protect, adminOnly, optionalAuth } = require("../middleware/auth");

router.post("/", optionalAuth, createOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/admin/stats", protect, adminOnly, getDashboardStats);
router.get("/admin", protect, adminOnly, getAllOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

module.exports = router;
