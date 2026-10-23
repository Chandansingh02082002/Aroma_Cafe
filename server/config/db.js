const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from server/.env");
    }

    // Set MONGO_DB_NAME to the database that already contains Aroma's data.
    // If it is not supplied, MongoDB's URI/default database selection is used.
    const options = process.env.MONGO_DB_NAME?.trim()
      ? { dbName: process.env.MONGO_DB_NAME.trim() }
      : {};

    const connection = await mongoose.connect(
      process.env.MONGO_URI,
      options
    );

    console.log(
      `MongoDB connected: ${connection.connection.host}/${connection.connection.name}`
    );
    return connection;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

module.exports = connectDB;
