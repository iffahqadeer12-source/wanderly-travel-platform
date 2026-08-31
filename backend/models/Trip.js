const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    time: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    category: {
      type: String,
      enum: [
        "Food",
        "Adventure",
        "Culture",
        "Shopping",
        "Sightseeing",
        "Relaxation",
        "Other",
      ],
      default: "Sightseeing",
    },
  },
  { _id: true }
);

const itineraryDaySchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    activities: {
      type: [activitySchema],
      default: [],
    },
  },
  { _id: true }
);

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    tripName: {
      type: String,
      required: true,
      trim: true,
    },

    destination: {
      type: String,
      required: true,
      trim: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    travelers: {
      type: Number,
      required: true,
      min: 1,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    itinerary: {
      type: [itineraryDaySchema],
      default: [],
    },

    status: {
      type: String,
      enum: ["Planning", "Upcoming", "Completed"],
      default: "Planning",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Trip", tripSchema);
