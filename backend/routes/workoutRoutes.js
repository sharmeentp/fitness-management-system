const express = require("express");
const router = express.Router();

const {
  createWorkout,
  getWorkouts,
  markWorkoutCompleted,
  updateWorkout,
  deleteWorkout,
} = require("../controllers/workoutController");

const protect = require("../middlewares/authMiddleware");

// ================= CREATE WORKOUT (Trainer Only) =================
router.post("/", protect, createWorkout);

// ================= GET WORKOUTS (Trainer or User) =================
router.get("/", protect, getWorkouts);

// ================= UPDATE WORKOUT (Trainer Only) =================
router.put("/:id", protect, updateWorkout);

// ================= DELETE WORKOUT (Trainer Only) =================
router.delete("/:id", protect, deleteWorkout);

// ================= MARK WORKOUT COMPLETED (User Only) =================
router.put("/:id/complete", protect, markWorkoutCompleted);

module.exports = router;

