const axios = require("axios");
const crypto = require("crypto");

/*
 * =========================================================
 * RAZORPAY CONFIG
 * =========================================================
 */

const razorpayBaseURL = "https://api.razorpay.com/v1";

const razorpayAuth = {
  username: process.env.RAZORPAY_KEY_ID,
  password: process.env.RAZORPAY_KEY_SECRET,
};

/*
 * =========================================================
 * CREATE RAZORPAY ORDER
 *
 * POST /api/payments/create-order
 * =========================================================
 */

const createPaymentOrder = async (req, res) => {
  try {
    const { amount, receipt, notes } = req.body;

    if (!amount) {
      return res.status(400).json({
        success: false,
        message: "Payment amount is required.",
      });
    }

    const numericAmount = Number(amount);

    if (
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment amount.",
      });
    }

    /*
     * Razorpay expects amount in paise.
     *
     * Example:
     * ₹500 -> 50000 paise
     */

    const amountInPaise = Math.round(
      numericAmount * 100
    );

    const razorpayOrder = await axios.post(
      `${razorpayBaseURL}/orders`,
      {
        amount: amountInPaise,
        currency: "INR",

        receipt:
          receipt ||
          `AROMA_${Date.now()}`,

        notes: notes || {},

        /*
         * We want the payment to be captured
         * automatically in the test/live configuration.
         */
        payment_capture: 1,
      },
      {
        auth: razorpayAuth,

        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(201).json({
      success: true,

      data: {
        id: razorpayOrder.data.id,
        amount: razorpayOrder.data.amount,
        currency:
          razorpayOrder.data.currency,
        status: razorpayOrder.data.status,

        keyId:
          process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (error) {
    console.error(
      "Razorpay create order error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message:
        error.response?.data?.error?.description ||
        "Unable to create Razorpay order.",
    });
  }
};

/*
 * =========================================================
 * VERIFY RAZORPAY PAYMENT
 *
 * POST /api/payments/verify
 * =========================================================
 */

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Missing Razorpay payment verification fields.",
      });
    }

    /*
     * Razorpay signature:
     *
     * HMAC-SHA256(
     *   razorpay_order_id + "|" + razorpay_payment_id,
     *   RAZORPAY_KEY_SECRET
     * )
     */

    const generatedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env.RAZORPAY_KEY_SECRET
        )
        .update(
          `${razorpay_order_id}|${razorpay_payment_id}`
        )
        .digest("hex");

    /*
     * Use timingSafeEqual rather than plain ===.
     */

    const expectedBuffer =
      Buffer.from(generatedSignature, "utf8");

    const receivedBuffer =
      Buffer.from(razorpay_signature, "utf8");

    const signaturesMatch =
      expectedBuffer.length ===
        receivedBuffer.length &&
      crypto.timingSafeEqual(
        expectedBuffer,
        receivedBuffer
      );

    if (!signaturesMatch) {
      return res.status(400).json({
        success: false,
        message:
          "Payment verification failed.",
      });
    }

    /*
     * IMPORTANT:
     *
     * Payment is considered authentic only after
     * this server-side signature verification.
     */

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully.",

      data: {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      },
    });
  } catch (error) {
    console.error(
      "Razorpay verification error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to verify payment.",
    });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
};