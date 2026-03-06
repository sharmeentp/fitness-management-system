const Workout = require("../models/Workout");
const User = require("../models/User");

// ================= CREATE WORKOUT (Trainer Only) =================
exports.createWorkout = async (req, res) => {
  try {
    const { userId, title, description } = req.body;

    if (req.user.role !== "trainer") {
      return res.status(403).json({ message: "Only trainers can assign workouts" });
    }

    const user = await User.findById(userId);
    if (!user || user.role !== "user") {
      return res.status(400).json({ message: "Invalid user" });
    }

    const workout = await Workout.create({
      user: userId,
      trainer: req.user._id,
      title,
      description,
      completed: false,
    });

    res.status(201).json(workout);
  } catch (error) {
    console.log("CREATE WORKOUT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= GET WORKOUTS =================
exports.getWorkouts = async (req, res) => {
  try {
    let workouts;

    if (req.user.role === "trainer") {
      workouts = await Workout.find({ trainer: req.user._id })
        .populate("user", "name email");
    } else {
      workouts = await Workout.find({ user: req.user._id })
        .populate("trainer", "name email");
    }

    res.json(workouts);
  } catch (error) {
    console.log("GET WORKOUTS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= MARK WORKOUT COMPLETED (User Only) =================
exports.markWorkoutCompleted = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    if (workout.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    workout.completed = true;
    await workout.save();

    res.json(workout);
  } catch (error) {
    console.log("MARK COMPLETE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE WORKOUT (Trainer Only) =================
exports.updateWorkout = async (req, res) => {
  try {
    if (req.user.role !== "trainer") {
      return res.status(403).json({ message: "Only trainers can update workouts" });
    }

    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    if (workout.trainer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    workout.title = req.body.title || workout.title;
    workout.description = req.body.description || workout.description;

    await workout.save();

    res.json(workout);
  } catch (error) {
    console.log("UPDATE WORKOUT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= DELETE WORKOUT (Trainer Only) =================
exports.deleteWorkout = async (req, res) => {
  try {
    if (req.user.role !== "trainer") {
      return res.status(403).json({ message: "Only trainers can delete workouts" });
    }

    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    if (workout.trainer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await workout.deleteOne();

    res.json({ message: "Workout deleted successfully" });
  } catch (error) {
    console.log("DELETE WORKOUT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


