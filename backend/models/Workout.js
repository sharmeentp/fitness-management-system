const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now },
  activity: { type: String, required: true },
  duration: { type: Number }, // minutes
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Workout", workoutSchema);
