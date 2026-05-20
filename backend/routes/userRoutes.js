const express = require("express");
const router = express.Router();
const { getAllUsers, getUserById, updateUser, deleteUser, sendContact } = require("../controllers/userController");
const { protect, adminOnly } = require("../middleware/auth");

router.post("/contact", sendContact);
router.get("/", protect, adminOnly, getAllUsers);
router.get("/:id", protect, adminOnly, getUserById);
router.put("/:id", protect, adminOnly, updateUser);
router.delete("/:id", protect, adminOnly, deleteUser);

module.exports = router;
