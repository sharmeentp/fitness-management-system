const Nutrition = require("../models/Nutrition");

// CREATE
const createNutrition = async (req, res) => {
  try {
    const { title, description, user } = req.body;

    const nutrition = await Nutrition.create({
      title,
      description,
      trainer: req.user._id,
      user,   // 👈 assign user
    });

    res.status(201).json(nutrition);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// GET ALL
const getNutrition = async (req, res) => {
  try {
    let nutritions;

    if (req.user.role === "trainer") {
      nutritions = await Nutrition.find({
        trainer: req.user._id,
      }).populate("user", "name email");
    } else {
      nutritions = await Nutrition.find({
        user: req.user._id,
      });
    }

    res.json(nutritions);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// DELETE
const deleteNutrition = async (req, res) => {
  try {
    await Nutrition.findByIdAndDelete(req.params.id);
    res.json({ message: "Nutrition deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createNutrition,
  getNutrition,
  deleteNutrition,
};