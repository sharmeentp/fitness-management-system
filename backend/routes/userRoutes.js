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
  getAssignedUsers,
  getApprovedTrainers,
  deleteUser
} = require("../controllers/authController");

const protect = require("../middlewares/authMiddleware");

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Assign trainer
router.put("/assign-trainer/:userId", protect, assignTrainer);

// Admin routes
router.get("/all-users", protect, getAllUsers);
router.get("/all-trainers", protect, getAllTrainers);

// Trainer routes
router.get("/my-users", protect, getMyUsers);

// User profile
router.get("/profile", protect, getMyProfile);

// Premium upgrade
router.put("/upgrade", protect, upgradeUser);

// Admin approval
router.put("/approve/:id", protect, approveUser);
router.put("/approve-trainer/:id", protect, approveTrainer);

// Assigned users
router.get("/assigned-users", protect, getAssignedUsers);

// Approved trainers
router.get("/approved-trainers", protect, getApprovedTrainers);

// Delete user or trainer
router.delete("/:id", protect, deleteUser);

module.exports = router;