const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    _id: false,
  }
);

const orderSchema = new mongoose.Schema(
  {
    /*
     * =======================================================
     * CUSTOMER
     * =======================================================
     */

    customer: {
      name: {
        type: String,
        required: [true, "Customer name is required"],
        trim: true,
      },

      email: {
        type: String,
        required: [true, "Customer email is required"],
        lowercase: true,
        trim: true,
      },

      phone: {
        type: String,
        required: [true, "Customer phone is required"],
        trim: true,
      },
    },

    /*
     * =======================================================
     * ITEMS
     * =======================================================
     */

    items: {
      type: [orderItemSchema],
      required: true,

      validate: {
        validator: (items) =>
          items.length > 0,

        message:
          "Order must contain at least one item",
      },
    },

    /*
     * =======================================================
     * TOTAL
     * =======================================================
     */

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    /*
     * =======================================================
     * ORDER STATUS
     * =======================================================
     */

    status: {
      type: String,

      enum: [
        "Pending",
        "Confirmed",
        "Preparing",
        "Ready",
        "Completed",
        "Cancelled",
      ],

      default: "Pending",
    },

    /*
     * =======================================================
     * PAYMENT
     * =======================================================
     */

    paymentStatus: {
      type: String,

      enum: [
        "Pending",
        "Paid",
        "Failed",
        "Refunded",
      ],

      default: "Pending",
    },

    paymentMethod: {
      type: String,

      enum: [
        "Razorpay",
        "COD",
      ],

      default: "Razorpay",
    },

    razorpayOrderId: {
      type: String,
      trim: true,
      sparse: true,
      unique: true,
    },

    razorpayPaymentId: {
      type: String,
      trim: true,
      sparse: true,
    },

    razorpaySignature: {
      type: String,
      trim: true,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.model(
    "Order",
    orderSchema
  );