const Booking = require("../models/Booking");
const Service = require("../models/Service");

// CREATE BOOKING
const createBooking = async (req, res) => {
  try {
    const {
      service,
      bookingDate,
      numberOfPeople,
      specialRequest,
    } = req.body;

    if (
      !service ||
      !bookingDate ||
      !numberOfPeople
    ) {
      return res.status(400).json({
        message: "Please provide all required booking details",
      });
    }

    const selectedService = await Service.findById(service);

    if (!selectedService) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    if (!selectedService.availability) {
      return res.status(400).json({
        message: "This service is currently unavailable",
      });
    }

    const totalPrice =
      selectedService.price * Number(numberOfPeople);

    const bookingId =
      "BK-" +
      Date.now() +
      "-" +
      Math.floor(Math.random() * 1000);

    const booking = await Booking.create({
      bookingId,
      user: req.user._id,
      service: selectedService._id,
      bookingDate,
      numberOfPeople,
      totalPrice,
      specialRequest: specialRequest || "",
      status: "Pending",
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Create booking error:", error);

    res.status(500).json({
      message: "Server error while creating booking",
    });
  }
};


// GET USER BOOKINGS
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user._id,
    })
      .populate("service")
      .sort({ createdAt: -1 });

    res.status(200).json({
      bookings,
    });
  } catch (error) {
    console.error("Get user bookings error:", error);

    res.status(500).json({
      message: "Server error while getting bookings",
    });
  }
};


// GET SINGLE BOOKING
const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate("service");

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error("Get booking error:", error);

    res.status(500).json({
      message: "Server error while getting booking",
    });
  }
};


// UPDATE BOOKING
const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    const {
      bookingDate,
      numberOfPeople,
      specialRequest,
    } = req.body;

    if (bookingDate !== undefined) {
      booking.bookingDate = bookingDate;
    }

    if (numberOfPeople !== undefined) {
      booking.numberOfPeople = numberOfPeople;

      const selectedService = await Service.findById(
        booking.service
      );

      if (selectedService) {
        booking.totalPrice =
          selectedService.price *
          Number(numberOfPeople);
      }
    }

    if (specialRequest !== undefined) {
      booking.specialRequest = specialRequest;
    }

    const updatedBooking = await booking.save();

    res.status(200).json({
      message: "Booking updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Update booking error:", error);

    res.status(500).json({
      message: "Server error while updating booking",
    });
  }
};


// CANCEL BOOKING
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    booking.status = "Cancelled";

    const updatedBooking = await booking.save();

    res.status(200).json({
      message: "Booking cancelled successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Cancel booking error:", error);

    res.status(500).json({
      message: "Server error while cancelling booking",
    });
  }
};


module.exports = {
  createBooking,
  getUserBookings,
  getBooking,
  updateBooking,
  cancelBooking,
};
