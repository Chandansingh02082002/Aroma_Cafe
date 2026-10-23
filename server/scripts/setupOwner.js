require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const connectDB = require("../config/db");

async function setupOwner() {
  try {
    const email = process.env.RESET_OWNER_EMAIL?.trim().toLowerCase();
    const password = process.env.RESET_OWNER_PASSWORD;
    const requestedName = process.env.RESET_OWNER_NAME?.trim();

    if (!email || !password) {
      throw new Error(
        "Set RESET_OWNER_EMAIL and RESET_OWNER_PASSWORD in this PowerShell session before running the script."
      );
    }

    if (password.length < 8) {
      throw new Error("Use a new password with at least 8 characters.");
    }

    await connectDB();

    const existingAdmin = await Admin.findOne({ email });
    const hashedPassword = await bcrypt.hash(password, 12);

    if (existingAdmin) {
      existingAdmin.password = hashedPassword;
      if (requestedName) existingAdmin.name = requestedName;
      await existingAdmin.save();
      console.log("Owner password updated successfully.");
      console.log(`Login email: ${existingAdmin.email}`);
    } else {
      const newAdmin = await Admin.create({
        name: requestedName || "Aroma Owner",
        email,
        password: hashedPassword,
      });
      console.log("Owner account created successfully.");
      console.log(`Login email: ${newAdmin.email}`);
    }

    console.log("No menu items, orders, or reviews were modified.");
  } catch (error) {
    console.error("Owner setup failed:", error.message);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
}

setupOwner();
