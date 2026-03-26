const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "user" },
  isApproved: { type: Boolean, default: false },

  isPremium: {
  type: Boolean,
  default: false,
},
  age: Number,
  gender: String,
  height: Number,
  weight: Number,

  qualification: String,
  experience: String,

  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

// 🔐 HASH PASSWORD
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 🔐 MATCH PASSWORD
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);