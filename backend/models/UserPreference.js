const mongoose = require("mongoose");

const userPreferenceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    budget: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true,
    },

    travelStyle: {
      type: String,
      enum: [
        "Adventure",
        "Relaxation",
        "Cultural",
        "Family",
        "Luxury",
        "Budget",
      ],
      required: true,
    },

    preferredCategory: {
      type: String,
      required: true,
      trim: true,
    },

    preferredLocation: {
      type: String,
      required: true,
      trim: true,
    },

    tripDuration: {
      type: Number,
      required: true,
      min: 1,
      max: 60,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserPreference", userPreferenceSchema);
