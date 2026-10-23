const express = require("express");

const {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
} = require("../controllers/orderController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Customer
router.post("/", createOrder);
router.get("/:id", getOrder);

// Owner
router.get("/", protect, getOrders);
router.patch("/:id/status", protect, updateOrderStatus);

module.exports = router;