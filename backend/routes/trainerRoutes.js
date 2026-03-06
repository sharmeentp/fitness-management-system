const express = require("express");
const router = express.Router();
const Trainer = require("../models/Trainer");

// Register Trainer
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, specialization } = req.body;

    const newTrainer = new Trainer({
      name,
      email,
      password,
      specialization,
    });

    await newTrainer.save();

    res.status(201).json({ message: "Trainer registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
