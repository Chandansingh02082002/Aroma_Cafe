const express = require("express");

const {
  createPaymentOrder,
  verifyPayment,
} = require("../controllers/paymentController");

const router = express.Router();

/*
 * Create Razorpay order
 */
router.post(
  "/create-order",
  createPaymentOrder
);

/*
 * Verify successful Razorpay payment
 */
router.post(
  "/verify",
  verifyPayment
);

module.exports = router;