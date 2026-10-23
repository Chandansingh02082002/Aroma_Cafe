const express = require("express");

const {
  createReview,
  getOrderReview,
  getReviews,
  replyToReview,
} = require("../controllers/reviewController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

/*
 * Customer
 */

router.post(
  "/",
  createReview
);

router.get(
  "/order/:orderId",
  getOrderReview
);

/*
 * Owner
 */

router.get(
  "/",
  protect,
  getReviews
);

router.patch(
  "/:id/reply",
  protect,
  replyToReview
);

module.exports = router;