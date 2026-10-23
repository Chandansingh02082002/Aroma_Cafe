const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Menu item name is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Menu item description is required"],
      trim: true,
    },

    price: {
      type: Number,
      required: [true, "Menu item price is required"],
      min: 0,
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },

    image: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
    },
    imagePublicId: {
  type: String,
  default: "",
},

    available: {
      type: Boolean,
      default: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);