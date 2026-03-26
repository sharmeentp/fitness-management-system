const express = require("express");
const router = express.Router();

const BMI = require("../models/BMI");
const User = require("../models/User");
const protect = require("../middlewares/authMiddleware");

router.post("/", protect, async (req, res) => {
  try {
    const { userId, height, weight, bmi } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isPremium) {
      return res.status(403).json({
        message: "Only Premium users allowed",
      });
    }

    const newBMI = await BMI.create({
      userId,
      height,
      weight,
      bmi,
    });

    res.status(201).json(newBMI);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error saving BMI" });
  }
});

module.exports = router;