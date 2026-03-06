const express = require("express");
const router = express.Router();

const {
  createNutrition,
  getNutrition,
  deleteNutrition,
} = require("../controllers/nutritionController");

const protect = require("../middlewares/authMiddleware");

router.post("/", protect, createNutrition);
router.get("/", protect, getNutrition);
router.delete("/:id", protect, deleteNutrition);

module.exports = router;