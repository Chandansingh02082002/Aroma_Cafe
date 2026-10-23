const Order = require("../models/Order");
const MenuItem = require("../models/MenuItem");

/*
 * =========================================================
 * POST /api/orders
 *
 * Creates the actual Aroma order AFTER payment verification.
 * =========================================================
 */

const createOrder = async (req, res) => {
  try {
    const {
      customer,
      items,

      paymentMethod,
      paymentStatus,

      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = req.body;

    /*
     * -------------------------------------------------------
     * CUSTOMER VALIDATION
     * -------------------------------------------------------
     */

    if (
      !customer?.name ||
      !customer?.email ||
      !customer?.phone
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Customer name, email and phone are required",
      });
    }

    /*
     * -------------------------------------------------------
     * ITEMS VALIDATION
     * -------------------------------------------------------
     */

    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Order must contain at least one item",
      });
    }

    /*
     * -------------------------------------------------------
     * PAYMENT VALIDATION
     *
     * For now, Aroma checkout uses Razorpay.
     * The frontend reaches this endpoint only after
     * /api/payments/verify succeeds.
     * -------------------------------------------------------
     */

    if (
      paymentMethod &&
      paymentMethod !== "Razorpay" &&
      paymentMethod !== "COD"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    /*
     * If Razorpay was used, require its identifiers.
     */

    if (paymentMethod === "Razorpay") {
      if (
        !razorpayOrderId ||
        !razorpayPaymentId ||
        !razorpaySignature
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Razorpay payment information is incomplete",
        });
      }
    }

    /*
     * -------------------------------------------------------
     * FETCH CURRENT MENU ITEMS
     *
     * We deliberately DO NOT trust the price sent by React.
     * The server gets the current price from MongoDB.
     * -------------------------------------------------------
     */

    const menuItemIds = items.map(
      (item) => item.menuItem
    );

    const menuItems = await MenuItem.find({
      _id: {
        $in: menuItemIds,
      },

      available: true,
    });

    /*
     * Make sure every requested item exists.
     */

    if (
      menuItems.length !==
      new Set(
        menuItemIds.map(String)
      ).size
    ) {
      return res.status(400).json({
        success: false,
        message:
          "One or more menu items are unavailable",
      });
    }

    /*
     * -------------------------------------------------------
     * BUILD ORDER ITEMS
     * -------------------------------------------------------
     */

    const orderItems = [];

    let totalAmount = 0;

    for (const item of items) {
      const menuItem = menuItems.find(
        (menu) =>
          menu._id.toString() ===
          String(item.menuItem)
      );

      if (!menuItem) {
        return res.status(400).json({
          success: false,
          message:
            `Menu item ${item.menuItem} is unavailable`,
        });
      }

      const quantity = Number(
        item.quantity
      );

      /*
       * Quantity must be a positive integer.
       */

      if (
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid item quantity",
        });
      }

      /*
       * Use MongoDB price, never client price.
       */

      const itemTotal =
        Number(menuItem.price) *
        quantity;

      totalAmount += itemTotal;

      orderItems.push({
        menuItem: menuItem._id,

        name: menuItem.name,

        price: menuItem.price,

        quantity,
      });
    }

    /*
     * -------------------------------------------------------
     * NORMALIZE PAYMENT STATE
     * -------------------------------------------------------
     */

    const finalPaymentMethod =
      paymentMethod || "Razorpay";

    const finalPaymentStatus =
      paymentStatus ||
      (finalPaymentMethod ===
      "Razorpay"
        ? "Paid"
        : "Pending");

    /*
     * -------------------------------------------------------
     * CREATE ORDER
     * -------------------------------------------------------
     */

    const order = await Order.create({
      customer,

      items: orderItems,

      totalAmount,

      /*
       * New orders start as Pending from the café's
       * operational point of view.
       */

      status: "Pending",

      paymentMethod:
        finalPaymentMethod,

      paymentStatus:
        finalPaymentStatus,

      razorpayOrderId:
        finalPaymentMethod ===
        "Razorpay"
          ? razorpayOrderId
          : undefined,

      razorpayPaymentId:
        finalPaymentMethod ===
        "Razorpay"
          ? razorpayPaymentId
          : undefined,

      razorpaySignature:
        finalPaymentMethod ===
        "Razorpay"
          ? razorpaySignature
          : undefined,
    });

    /*
     * -------------------------------------------------------
     * RESPONSE
     * -------------------------------------------------------
     */

    return res.status(201).json({
      success: true,

      message:
        "Order placed successfully",

      data: order,
    });
  } catch (error) {
    console.error(
      "Create order error:",
      error
    );

    /*
     * Duplicate Razorpay order ID
     */

    if (
      error.code === 11000 &&
      error.keyPattern?.razorpayOrderId
    ) {
      return res.status(409).json({
        success: false,
        message:
          "This payment has already been used for an order.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Failed to create order",
    });
  }
};

/*
 * =========================================================
 * GET /api/orders
 *
 * Owner only.
 * =========================================================
 */

const getOrders = async (req, res) => {
  try {
    const orders =
      await Order.find()
        .sort({
          createdAt: -1,
        })
        .populate(
          "items.menuItem",
          "name category image"
        );

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error(
      "Get orders error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch orders",
    });
  }
};

/*
 * =========================================================
 * GET /api/orders/:id
 * =========================================================
 */

const getOrder = async (req, res) => {
  try {
    const order =
      await Order.findById(
        req.params.id
      ).populate(
        "items.menuItem",
        "name category image"
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error(
      "Get order error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch order",
    });
  }
};

/*
 * =========================================================
 * PATCH /api/orders/:id/status
 *
 * Owner only.
 * =========================================================
 */

const updateOrderStatus = async (
  req,
  res
) => {
  try {
    const { status } =
      req.body;

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Preparing",
      "Ready",
      "Completed",
      "Cancelled",
    ];

    if (
      !allowedStatuses.includes(
        status
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid order status",
      });
    }

    const updateData = {
      status,
    };

    /*
     * If the owner completes an order,
     * keep payment information intact.
     *
     * Later we'll use this status to determine
     * whether the customer is allowed to review.
     */

    const order =
      await Order.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message:
          "Order not found",
      });
    }

    return res.status(200).json({
      success: true,

      message:
        "Order status updated",

      data: order,
    });
  } catch (error) {
    console.error(
      "Update order status error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update order status",
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
};