const express = require("express");

const {
  createTrip,
  getTrips,
  getTrip,
  updateTrip,
  deleteTrip,
  addItineraryDay,
  addActivity,
  updateActivity,
  deleteActivity,
} = require("../controllers/tripController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ===============================
// TRIPS
// ===============================

// Create a new trip
router.post("/", protect, createTrip);

// Get all trips of logged-in user
router.get("/", protect, getTrips);

// Get one trip
router.get("/:id", protect, getTrip);

// Update trip
router.put("/:id", protect, updateTrip);

// Delete trip
router.delete("/:id", protect, deleteTrip);
// Add itinerary day
router.post(
  "/:id/days",
  protect,
  addItineraryDay
);

// ===============================
// ACTIVITIES
// ===============================

// Add activity to an itinerary day
router.post(
  "/:id/days/:dayId/activities",
  protect,
  addActivity
);

// Edit activity
router.put(
  "/:id/days/:dayId/activities/:activityId",
  protect,
  updateActivity
);

// Delete activity
router.delete(
  "/:id/days/:dayId/activities/:activityId",
  protect,
  deleteActivity
);

module.exports = router;
