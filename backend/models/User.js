const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["user", "trainer", "admin"],
    default: "user"
  },

  qualification: {
    type: String
  },

  experience: {
    type: Number
  },

  specialization: {
    type: String
  },

  isApproved: {
    type: Boolean,
    default: false
  },

  height: {
    type: Number
  },

  weight: {
    type: Number
  },

  // ⭐ THIS WAS MISSING
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

},
{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);