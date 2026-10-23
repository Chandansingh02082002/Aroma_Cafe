require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const menuRoutes = require("./routes/menuRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const protect = require("./middleware/authMiddleware");

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());


/*
 * =========================================================
 * HEALTH CHECK
 * =========================================================
 */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message:
      "Cafe API is running",
  });
});

/*
 * =========================================================
 * API
 * =========================================================
 */

app.use(
  "/api/menu",
  menuRoutes
);

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/orders",
  orderRoutes
);

app.use(
  "/api/uploads",
  uploadRoutes
);

app.use(
  "/api/payments",
  paymentRoutes
);

app.use(
  "/api/reviews",
  reviewRoutes
);

/*
 * =========================================================
 * CURRENT ADMIN
 * =========================================================
 */

app.get(
  "/api/auth/me",
  protect,
  (req, res) => {
    res.status(200).json({
      success: true,
      data: req.admin,
    });
  }
);

/*
 * =========================================================
 * 404
 * =========================================================
 */

app.use(
  (req, res) => {
    res.status(404).json({
      success: false,
      message:
        "Route not found.",
    });
  }
);

/*
 * =========================================================
 * ERROR HANDLER
 * =========================================================
 */

app.use(
  (err, req, res, next) => {
    console.error(
      "Unhandled server error:",
      err
    );

    res.status(500).json({
      success: false,
      message:
        "Internal server error.",
    });
  }
);

/*
 * =========================================================
 * SERVER
 * =========================================================
 */

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Do not accept requests until MongoDB is connected.
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup aborted because the database is unavailable.");
    process.exit(1);
  }
};

startServer();