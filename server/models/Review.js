const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    /*
     * =======================================================
     * ORDER
     * =======================================================
     */

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
      index: true,
    },

    /*
     * =======================================================
     * CUSTOMER
     *
     * Snapshot from the order so the review still has
     * customer information even if the order changes later.
     * =======================================================
     */

    customer: {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
      },
    },

    /*
     * =======================================================
     * REVIEW
     * =======================================================
     */

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 1000,
    },

    /*
     * =======================================================
     * OWNER REPLY
     * =======================================================
     */

    ownerReply: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    repliedAt: {
      type: Date,
      default: null,
    },

    /*
     * =======================================================
     * VISIBILITY
     * =======================================================
     */

    status: {
      type: String,
      enum: [
        "Published",
        "Hidden",
      ],
      default: "Published",
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.model(
    "Review",
    reviewSchema
  );