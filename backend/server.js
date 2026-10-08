const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

dotenv.config();

const app = express();

// ==========================================
// MongoDB
// ==========================================

connectDB();

// ==========================================
// Middleware
// ==========================================

app.use(cors());
app.use(express.json());

// ==========================================
// Routes
// ==========================================

// User Routes
const userRoutes = require("./routes/userRoutes");

app.use("/api/users", userRoutes);


// Contact Routes
const contactRoutes = require("./routes/contactRoutes");

app.use("/api/contact", contactRoutes);


// Product Routes
const productRoutes = require("./routes/productRoutes");

app.use("/api/products", productRoutes);


// Order Routes
const orderRoutes = require("./routes/orderRoutes");

app.use("/api/orders", orderRoutes);


// ==========================================
// Test API
// ==========================================

app.get("/", (req, res) => {
  res.json({
    message: "ShopEase API is running",
  });
});


// ==========================================
// Server
// ==========================================

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
