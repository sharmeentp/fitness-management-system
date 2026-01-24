const express = require("express");
const router = express.Router();

// Controllers
const { register, login } = require("../controllers/authController");

// Middleware
const { protect } = require("../middlewares/authMiddleware");

// ===============================
// AUTH ROUTES
// ===============================

// Register user
router.post("/register", register);

// Login user
router.post("/login", login);

// Protected route - User profile
router.get("/profile", protect, (req, res) => {
  res.status(200).json({
    message: "Profile accessed successfully",
    user: req.user
  });
});

module.exports = router;
