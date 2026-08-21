const express = require("express");

const {
  getProfile,
  updateProfile,
  addFavorite,
  removeFavorite,
  getFavorites,
  addRecentlyViewed,
  getRecentlyViewed,
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Profile
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// Favorites
router.get("/favorites", protect, getFavorites);
router.post("/favorites/:destinationId", protect, addFavorite);
router.delete("/favorites/:destinationId", protect, removeFavorite);

// Recently Viewed
router.get("/recently-viewed", protect, getRecentlyViewed);
router.post("/recently-viewed/:destinationId", protect, addRecentlyViewed);

module.exports = router;
