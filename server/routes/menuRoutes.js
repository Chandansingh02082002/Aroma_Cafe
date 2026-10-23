const express = require("express");

const {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/menuController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", getMenuItems);
router.get("/:id", getMenuItem);

// Protected owner routes
router.post("/", protect, createMenuItem);
router.put("/:id", protect, updateMenuItem);
router.delete("/:id", protect, deleteMenuItem);

module.exports = router;