const express = require("express");
const router = express.Router();

const {
  savePreferences,
  getPreferences,
  getRecommendations,
} = require("../controllers/recommendationController");

const protect = require("../middleware/authMiddleware");

// Save or update preferences
router.post("/preferences", protect, savePreferences);

// Get saved preferences
router.get("/preferences", protect, getPreferences);

// Get personalized recommendations
router.get("/", protect, getRecommendations);

module.exports = router;