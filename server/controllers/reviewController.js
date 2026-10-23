const Review = require("../models/Review");
const Order = require("../models/Order");

/*
 * =========================================================
 * POST /api/reviews
 *
 * Customer creates a review.
 * Only a Completed order can be reviewed.
 * =========================================================
 */

const createReview = async (
  req,
  res
) => {
  try {
    const {
      orderId,
      email,
      rating,
      comment,
    } = req.body;

    /*
     * -------------------------------------------------------
     * VALIDATION
     * -------------------------------------------------------
     */

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message:
          "Order ID is required.",
      });
    }

    if (!email?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Customer email is required.",
      });
    }

    const numericRating =
      Number(rating);

    if (
      !Number.isInteger(
        numericRating
      ) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Rating must be between 1 and 5.",
      });
    }

    if (!comment?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Review comment is required.",
      });
    }

    /*
     * -------------------------------------------------------
     * FIND ORDER
     * -------------------------------------------------------
     */

    const order =
      await Order.findById(
        orderId
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message:
          "Order not found.",
      });
    }

    /*
     * -------------------------------------------------------
     * REVIEW GATE
     *
     * Customer can review only after the order
     * has been completed.
     * -------------------------------------------------------
     */

    if (
      order.status !==
      "Completed"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "You can review an order only after it has been completed.",
      });
    }

    /*
     * -------------------------------------------------------
     * EMAIL MATCH
     * -------------------------------------------------------
     */

    const normalizedEmail =
      email
        .trim()
        .toLowerCase();

    if (
      order.customer.email !==
      normalizedEmail
    ) {
      return res.status(403).json({
        success: false,
        message:
          "The email does not match the customer details on this order.",
      });
    }

    /*
     * -------------------------------------------------------
     * DUPLICATE CHECK
     * -------------------------------------------------------
     */

    const existingReview =
      await Review.findOne({
        order: orderId,
      });

    if (existingReview) {
      return res.status(409).json({
        success: false,
        message:
          "This order has already been reviewed.",
        data: existingReview,
      });
    }

    /*
     * -------------------------------------------------------
     * CREATE REVIEW
     * -------------------------------------------------------
     */

    const review =
      await Review.create({
        order: order._id,

        customer: {
          name: order.customer.name,
          email: order.customer.email,
        },

        rating:
          numericRating,

        comment:
          comment.trim(),

        status: "Published",
      });

    return res.status(201).json({
      success: true,
      message:
        "Thank you for your review.",

      data: review,
    });
  } catch (error) {
    console.error(
      "Create review error:",
      error
    );

    /*
     * Unique order index
     */

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "This order has already been reviewed.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Failed to create review.",
    });
  }
};

/*
 * =========================================================
 * GET /api/reviews/order/:orderId
 *
 * Customer checks whether an order has a review.
 * =========================================================
 */

const getOrderReview = async (
  req,
  res
) => {
  try {
    const review =
      await Review.findOne({
        order:
          req.params.orderId,
      });

    return res.status(200).json({
      success: true,

      exists: Boolean(review),

      data: review || null,
    });
  } catch (error) {
    console.error(
      "Get order review error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch review.",
    });
  }
};

/*
 * =========================================================
 * GET /api/reviews
 *
 * Owner reads all reviews.
 * =========================================================
 */

const getReviews = async (
  req,
  res
) => {
  try {
    const reviews =
      await Review.find({
        status: "Published",
      })
        .sort({
          createdAt: -1,
        })
        .populate(
          "order",
          "customer totalAmount status createdAt paymentStatus"
        );

    const total =
      reviews.length;

    const averageRating =
      total === 0
        ? 0
        : reviews.reduce(
            (sum, review) =>
              sum +
              review.rating,
            0
          ) / total;

    return res.status(200).json({
      success: true,

      count: total,

      averageRating:
        Number(
          averageRating.toFixed(1)
        ),

      data: reviews,
    });
  } catch (error) {
    console.error(
      "Get reviews error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch reviews.",
    });
  }
};

/*
 * =========================================================
 * PATCH /api/reviews/:id/reply
 *
 * Owner replies to a review.
 * =========================================================
 */

const replyToReview = async (
  req,
  res
) => {
  try {
    const {
      ownerReply,
    } = req.body;

    if (!ownerReply?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Reply cannot be empty.",
      });
    }

    const review =
      await Review.findByIdAndUpdate(
        req.params.id,
        {
          ownerReply:
            ownerReply.trim(),
          repliedAt: new Date(),
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!review) {
      return res.status(404).json({
        success: false,
        message:
          "Review not found.",
      });
    }

    return res.status(200).json({
      success: true,

      message:
        "Reply added successfully.",

      data: review,
    });
  } catch (error) {
    console.error(
      "Reply to review error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to reply to review.",
    });
  }
};

module.exports = {
  createReview,
  getOrderReview,
  getReviews,
  replyToReview,
};