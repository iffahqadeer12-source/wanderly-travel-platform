const express = require("express");

const {
  createBooking,
  getUserBookings,
  getBooking,
  updateBooking,
  cancelBooking,
} = require("../controllers/bookingController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// CREATE BOOKING
router.post("/", protect, createBooking);

// GET USER BOOKINGS
router.get("/", protect, getUserBookings);

// GET SINGLE BOOKING
router.get("/:id", protect, getBooking);

// UPDATE BOOKING
router.put("/:id", protect, updateBooking);

// CANCEL BOOKING
router.put("/:id/cancel", protect, cancelBooking);

module.exports = router;
