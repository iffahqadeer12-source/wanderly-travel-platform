const Trip = require("../models/Trip");

// CREATE TRIP
const createTrip = async (req, res) => {
  try {
    const {
      tripName,
      destination,
      startDate,
      endDate,
      travelers,
      description,
    } = req.body;

    if (
      !tripName ||
      !destination ||
      !startDate ||
      !endDate ||
      !travelers
    ) {
      return res.status(400).json({
        message: "Please provide all required trip details",
      });
    }

    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({
        message: "End date cannot be before start date",
      });
    }

    const trip = await Trip.create({
      user: req.user._id,
      tripName,
      destination,
      startDate,
      endDate,
      travelers,
      description,
    });

    res.status(201).json({
      message: "Trip created successfully",
      trip,
    });
  } catch (error) {
    console.error("Create trip error:", error);

    res.status(500).json({
      message: "Server error while creating trip",
    });
  }
};

// GET ALL USER TRIPS
const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      trips,
    });
  } catch (error) {
    console.error("Get trips error:", error);

    res.status(500).json({
      message: "Server error while getting trips",
    });
  }
};

// GET SINGLE TRIP
const getTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    res.status(200).json(trip);
  } catch (error) {
    console.error("Get trip error:", error);

    res.status(500).json({
      message: "Server error while getting trip",
    });
  }
};

// UPDATE TRIP
const updateTrip = async (req, res) => {
  try {
    const {
      tripName,
      destination,
      startDate,
      endDate,
      travelers,
      description,
      status,
    } = req.body;

    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    if (startDate && endDate) {
      if (new Date(endDate) < new Date(startDate)) {
        return res.status(400).json({
          message: "End date cannot be before start date",
        });
      }
    }

    if (tripName !== undefined) trip.tripName = tripName;
    if (destination !== undefined) trip.destination = destination;
    if (startDate !== undefined) trip.startDate = startDate;
    if (endDate !== undefined) trip.endDate = endDate;
    if (travelers !== undefined) trip.travelers = travelers;
    if (description !== undefined) trip.description = description;
    if (status !== undefined) trip.status = status;

    const updatedTrip = await trip.save();

    res.status(200).json({
      message: "Trip updated successfully",
      trip: updatedTrip,
    });
  } catch (error) {
    console.error("Update trip error:", error);

    res.status(500).json({
      message: "Server error while updating trip",
    });
  }
};

// DELETE TRIP
const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    await trip.deleteOne();

    res.status(200).json({
      message: "Trip deleted successfully",
    });
  } catch (error) {
    console.error("Delete trip error:", error);

    res.status(500).json({
      message: "Server error while deleting trip",
    });
  }
};

// ADD ACTIVITY
const addActivity = async (req, res) => {
  try {
    const {
      name,
      location,
      time,
      description,
      category,
    } = req.body;

    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    if (!name) {
      return res.status(400).json({
        message: "Activity name is required",
      });
    }

    const day = trip.itinerary.id(req.params.dayId);

    if (!day) {
      return res.status(404).json({
        message: "Itinerary day not found",
      });
    }

    day.activities.push({
      name,
      location,
      time,
      description,
      category,
    });

    await trip.save();

    res.status(201).json({
      message: "Activity added successfully",
      trip,
    });
  } catch (error) {
    console.error("Add activity error:", error);

    res.status(500).json({
      message: "Server error while adding activity",
    });
  }
};

// EDIT ACTIVITY
const updateActivity = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    const day = trip.itinerary.id(req.params.dayId);

    if (!day) {
      return res.status(404).json({
        message: "Itinerary day not found",
      });
    }

    const activity = day.activities.id(
      req.params.activityId
    );

    if (!activity) {
      return res.status(404).json({
        message: "Activity not found",
      });
    }

    const {
      name,
      location,
      time,
      description,
      category,
    } = req.body;

    if (name !== undefined) activity.name = name;
    if (location !== undefined)
      activity.location = location;
    if (time !== undefined) activity.time = time;
    if (description !== undefined)
      activity.description = description;
    if (category !== undefined)
      activity.category = category;

    await trip.save();

    res.status(200).json({
      message: "Activity updated successfully",
      trip,
    });
  } catch (error) {
    console.error("Update activity error:", error);

    res.status(500).json({
      message: "Server error while updating activity",
    });
  }
};

// DELETE ACTIVITY
const deleteActivity = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    const day = trip.itinerary.id(req.params.dayId);

    if (!day) {
      return res.status(404).json({
        message: "Itinerary day not found",
      });
    }

    const activity = day.activities.id(
      req.params.activityId
    );

    if (!activity) {
      return res.status(404).json({
        message: "Activity not found",
      });
    }

    activity.deleteOne();

    await trip.save();

    res.status(200).json({
      message: "Activity removed successfully",
      trip,
    });
  } catch (error) {
    console.error("Delete activity error:", error);

    res.status(500).json({
      message: "Server error while deleting activity",
    });
  }
};
// ADD ITINERARY DAY
const addItineraryDay = async (req, res) => {
  try {
    const { date } = req.body;

    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    if (!date) {
      return res.status(400).json({
        message: "Date is required",
      });
    }

    const newDayNumber = trip.itinerary.length + 1;

    trip.itinerary.push({
      day: newDayNumber,
      date,
      activities: [],
    });

    await trip.save();

    res.status(201).json({
      message: `Day ${newDayNumber} added successfully`,
      trip,
    });
  } catch (error) {
    console.error("Add itinerary day error:", error);

    res.status(500).json({
      message: "Server error while adding itinerary day",
    });
  }
};
module.exports = {
  createTrip,
  getTrips,
  getTrip,
  updateTrip,
  deleteTrip,
  addItineraryDay,
  addActivity,
  updateActivity,
  deleteActivity,
};