const express = require("express");

const {
  addReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
  getRatingSummary,
  markHelpful,
} = require("../controllers/reviewController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get all reviews
router.get("/", getReviews);

// Add review
router.post("/", protect, addReview);

// Get rating summary
router.get("/summary", getRatingSummary);

// Get single review
router.get("/:id", getReview);

// Update review
router.put("/:id", protect, updateReview);

// Delete review
router.delete("/:id", protect, deleteReview);

// Mark review as helpful
router.put("/:id/helpful", markHelpful);

module.exports = router;