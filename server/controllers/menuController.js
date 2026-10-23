const MenuItem = require("../models/MenuItem");

// GET /api/menu
const getMenuItems = async (req, res) => {
  try {
    const { category, featured, available } = req.query;

    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (featured !== undefined) {
      filter.featured = featured === "true";
    }

    if (available === "true") {
      // Older menu records may not have the `available` field at all.
      // Treat those records as available instead of hiding the entire menu.
      filter.available = { $ne: false };
    } else if (available === "false") {
      filter.available = false;
    }

    const menuItems = await MenuItem.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: menuItems.length,
      data: menuItems,
    });
  } catch (error) {
    console.error("Get menu error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch menu items",
    });
  }
};

// GET /api/menu/:id
const getMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    res.status(200).json({
      success: true,
      data: menuItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch menu item",
    });
  }
};

// POST /api/menu
const createMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.create(req.body);

    res.status(201).json({
      success: true,
      message: "Menu item created successfully",
      data: menuItem,
    });
  } catch (error) {
    console.error("Create menu error:", error.message);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// PUT /api/menu/:id
const updateMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Menu item updated successfully",
      data: menuItem,
    });
  } catch (error) {
    console.error("Update menu error:", error.message);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE /api/menu/:id
const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    console.error("Delete menu error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to delete menu item",
    });
  }
};

module.exports = {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
};