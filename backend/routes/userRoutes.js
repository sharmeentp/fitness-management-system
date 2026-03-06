const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  assignTrainer,
  getAllUsers,
  getAllTrainers,
  getMyUsers,
  getMyProfile,
  upgradeUser,
  approveUser,
  approveTrainer,
  getAssignedUsers
} = require("../controllers/authController");

const protect = require("../middlewares/authMiddleware");


// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Assign trainer to user
router.put("/assign-trainer/:userId", protect, assignTrainer);

// Admin routes
router.get("/all-users", protect, getAllUsers);
router.get("/all-trainers", protect, getAllTrainers);

// Trainer: get assigned users
router.get("/my-users", protect, getMyUsers);

// User profile
router.get("/profile", protect, getMyProfile);

// Upgrade to premium
router.put("/upgrade", protect, upgradeUser);

// Admin approve user/trainer
router.put("/approve/:id", protect, approveUser);

router.put("/approve-trainer/:id", protect, approveTrainer);
router.get("/assigned-users", protect, getAssignedUsers);

module.exports = router;
