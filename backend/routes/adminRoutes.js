const express = require("express");
const User = require("../models/User");
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");

const router = express.Router();

/*
    ADMIN ONLY ROUTES
*/

/* Get all users */
router.get("/users", protect, authorizeRoles("admin"), async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/* Create Trainer */
router.post("/create-trainer", protect, authorizeRoles("admin"), async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const trainerExists = await User.findOne({ email });
        if (trainerExists) {
            return res.status(400).json({ message: "Trainer already exists" });
        }

        const trainer = await User.create({
            name,
            email,
            password,
            role: "trainer",
        });

        res.status(201).json({
            message: "Trainer created successfully",
            trainer,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
