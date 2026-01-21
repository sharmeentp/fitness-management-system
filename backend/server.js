// Load environment variables FIRST
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Test route (to check backend)
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));

// Port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
