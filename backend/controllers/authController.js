const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

// ================= REGISTER =================
exports.registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      age,
      gender,
      height,
      weight,
      qualification,
      experience,
    } = req.body;

    const user = await User.create({
      name,
      email,
      password,
      role,
      age,
      gender,
      height,
      weight,
      qualification,
      experience,
      isApproved: false,
    });

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.log("REGISTER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= LOGIN =================
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // ✅ CHECK FIRST
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // ✅ THEN CHECK APPROVAL
    if (!user.isApproved) {
      return res.status(403).json({ message: "Waiting for admin approval" });
    }

    // ✅ PASSWORD CHECK
    if (await user.matchPassword(password)) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      return res.status(401).json({ message: "Invalid password" });
    }

  } catch (error) {
    console.log("LOGIN ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
// ================= ASSIGN TRAINER =================
exports.assignTrainer = async (req, res) => {
  try {
    const { trainerId } = req.body;
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const trainer = await User.findById(trainerId);
    if (!trainer || trainer.role !== "trainer") {
      return res.status(400).json({ message: "Invalid trainer" });
    }

    user.trainer = trainerId;
    await user.save();

    res.json({
      message: "Trainer assigned successfully",
      user,
    });
  } catch (error) {
    console.log("ASSIGN TRAINER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= ADMIN: GET ALL USERS =================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }); // ✅ ONLY USERS
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= ADMIN: GET ALL TRAINERS =================
exports.getAllTrainers = async (req, res) => {
  try {
    const trainers = await User.find({ role: "trainer" }); // ✅ ONLY TRAINERS
    res.json(trainers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ================= TRAINER: GET MY USERS =================
exports.getMyUsers = async (req, res) => {
  try {
    if (req.user.role !== "trainer") {
      return res.status(403).json({ message: "Trainer only" });
    }

    const users = await User.find({
      trainer: req.user._id,
      role: "user",
    }).select("-password");

    res.json(users);
  } catch (error) {
    console.log("GET MY USERS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= USER: GET MY PROFILE =================
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("trainer", "name email")
      .select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.log("GET MY PROFILE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.upgradeUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isPremium = true; // ⭐ THIS LINE IS KEY

    await user.save();

    res.json({
      message: "User upgraded to premium",
      user,
    });

  } catch (error) {
    console.log("UPGRADE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
// ================= USER: UPGRADE TO PREMIUM =================
exports.upgradeUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isPremium = true;
    await user.save();

    res.json({ message: "User upgraded to premium" });

  } catch (error) {
    console.log("UPGRADE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= ADMIN: APPROVE USER =================
exports.approveUser = async (req, res) => {
  try {

    // ✅ FIX: check req.user exists
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    const user = await User.findById(req.params.id);

    // ✅ FIX: check user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isApproved = true;
    await user.save();

    res.json({ message: "User approved successfully" });

  } catch (error) {
    console.log("APPROVE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
// ================= ADMIN: APPROVE TRAINER =================
exports.approveTrainer = async (req, res) => {
  try {

    // Only admin can approve
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    const trainer = await User.findById(req.params.id);

    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    if (trainer.role !== "trainer") {
      return res.status(400).json({ message: "This user is not a trainer" });
    }

    trainer.isApproved = true;
    await trainer.save();

    res.json({
      message: "Trainer approved successfully",
      trainer
    });

  } catch (error) {
    console.log("APPROVE TRAINER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= TRAINER: GET ASSIGNED USERS =================
exports.getAssignedUsers = async (req, res) => {
  try {
    const users = await User.find({
      trainer: req.user._id,
      role: "user",
      isApproved: true
    }).select("-password");

    res.json(users);
  } catch (error) {
    console.log("GET ASSIGNED USERS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getApprovedTrainers = async (req, res) => {
  try {
    const trainers = await User.find({
      role: "trainer",
      isApproved: true
    }).select("-password");

    res.json(trainers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= DELETE USER OR TRAINER (ADMIN ONLY) =================
exports.deleteUser = async (req, res) => {
  try {

    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ ADD THIS BLOCK HERE
    if (user.role === "admin") {
      return res.status(400).json({ message: "Cannot delete admin" });
    }

    await user.deleteOne();

    res.json({ message: "User deleted successfully" });

  } catch (error) {
    console.log("DELETE USER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


