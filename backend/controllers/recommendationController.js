const UserPreference = require("../models/UserPreference");
const Destination = require("../models/Destination");
const Service = require("../models/Service");
const User = require("../models/User");

// Save or update user preferences
const savePreferences = async (req, res) => {
  try {
    const {
      budget,
      travelStyle,
      preferredCategory,
      preferredLocation,
      tripDuration,
    } = req.body;

    if (
      !budget ||
      !travelStyle ||
      !preferredCategory ||
      !preferredLocation ||
      !tripDuration
    ) {
      return res.status(400).json({
        message: "All preference fields are required",
      });
    }

    if (tripDuration < 1 || tripDuration > 60) {
      return res.status(400).json({
        message: "Trip duration must be between 1 and 60 days",
      });
    }

    const preferences = await UserPreference.findOneAndUpdate(
      { user: req.user._id },
      {
        user: req.user._id,
        budget,
        travelStyle,
        preferredCategory,
        preferredLocation,
        tripDuration,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      message: "Preferences saved successfully",
      preferences,
    });
  } catch (error) {
    console.error("Save preferences error:", error);
    res.status(500).json({
      message: "Failed to save preferences",
    });
  }
};

// Get saved user preferences
const getPreferences = async (req, res) => {
  try {
    const preferences = await UserPreference.findOne({
      user: req.user._id,
    });

    if (!preferences) {
      return res.status(404).json({
        message: "No preferences found",
      });
    }

    res.status(200).json(preferences);
  } catch (error) {
    console.error("Get preferences error:", error);
    res.status(500).json({
      message: "Failed to get preferences",
    });
  }
};

// Generate personalized recommendations
const getRecommendations = async (req, res) => {
  try {
    const preferences = await UserPreference.findOne({
      user: req.user._id,
    });

    if (!preferences) {
      return res.status(404).json({
        message: "Please save your travel preferences first",
      });
    }

    const user = await User.findById(req.user._id)
      .populate("favorites")
      .populate("recentlyViewed");

    const destinations = await Destination.find({});
    const services = await Service.find({
      availability: true,
    });

    if (!destinations.length && !services.length) {
      return res.status(200).json({
        message: "No recommendations available",
        destinations: [],
        services: [],
      });
    }

    const favoriteIds = new Set(
      (user?.favorites || []).map((item) => String(item._id))
    );

    const recentlyViewedIds = new Set(
      (user?.recentlyViewed || []).map((item) => String(item._id))
    );

    const getBudgetMatch = (price) => {
      if (price === undefined || price === null) return false;

      if (preferences.budget === "Low") {
        return price <= 100;
      }

      if (preferences.budget === "Medium") {
        return price > 100 && price <= 300;
      }

      if (preferences.budget === "High") {
        return price > 300;
      }

      return false;
    };

    const getStyleMatch = (item) => {
      const text = `
        ${item.name || ""}
        ${item.description || ""}
        ${item.category || ""}
        ${item.features ? item.features.join(" ") : ""}
      `.toLowerCase();

      const styleKeywords = {
        Adventure: [
          "adventure",
          "hiking",
          "trekking",
          "camping",
          "sports",
          "activity",
          "explore",
        ],
        Relaxation: [
          "relax",
          "relaxation",
          "spa",
          "beach",
          "resort",
          "peaceful",
          "wellness",
        ],
        Cultural: [
          "culture",
          "cultural",
          "heritage",
          "museum",
          "history",
          "historical",
          "traditional",
        ],
        Family: [
          "family",
          "kids",
          "children",
          "child-friendly",
          "fun",
        ],
        Luxury: [
          "luxury",
          "premium",
          "five-star",
          "5-star",
          "exclusive",
          "vip",
        ],
        Budget: [
          "budget",
          "affordable",
          "cheap",
          "economical",
          "low-cost",
        ],
      };

      return (styleKeywords[preferences.travelStyle] || []).some((keyword) =>
        text.includes(keyword)
      );
    };

    const getDurationMatch = (item) => {
      const text = `
        ${item.name || ""}
        ${item.description || ""}
        ${item.category || ""}
      `.toLowerCase();

      const duration = Number(preferences.tripDuration);

      if (item.category === "Tour Package") {
        if (duration >= 3 && duration <= 14) return true;
      }

      if (item.category === "Activity") {
        if (duration >= 1 && duration <= 7) return true;
      }

      if (item.category === "Hotel") {
        if (duration >= 2) return true;
      }

      if (text.includes("week") && duration >= 7) return true;
      if (text.includes("day") && duration >= 1) return true;

      return false;
    };

    const calculateDestinationScore = (destination) => {
      let score = 0;
      const reasons = [];

      // Category = +3
      if (
        destination.category &&
        destination.category.toLowerCase() ===
          preferences.preferredCategory.toLowerCase()
      ) {
        score += 3;
        reasons.push("Matches your preferred category");
      }

      // Location = +2
      const preferredLocation = preferences.preferredLocation.toLowerCase();

      if (
        destination.city?.toLowerCase().includes(preferredLocation) ||
        destination.country?.toLowerCase().includes(preferredLocation)
      ) {
        score += 2;
        reasons.push("Matches your preferred location");
      }

      // Travel style = +3
      if (getStyleMatch(destination)) {
        score += 3;
        reasons.push(`Matches your ${preferences.travelStyle} travel style`);
      }

      // Duration = +1
      if (getDurationMatch(destination)) {
        score += 1;
        reasons.push("Fits your trip duration");
      }

      // Previous favorites = +1
      if (favoriteIds.has(String(destination._id))) {
        score += 1;
        reasons.push("Related to a destination you favorited");
      }

      // Recently viewed = +1
      if (recentlyViewedIds.has(String(destination._id))) {
        score += 1;
        reasons.push("You recently viewed this destination");
      }

      return { score, reasons };
    };

    const calculateServiceScore = (service) => {
      let score = 0;
      const reasons = [];

      // Category = +3
      if (
        service.category &&
        service.category.toLowerCase() ===
          preferences.preferredCategory.toLowerCase()
      ) {
        score += 3;
        reasons.push("Matches your preferred category");
      }

      // Location = +2
      const preferredLocation = preferences.preferredLocation.toLowerCase();

      if (
        service.location?.toLowerCase().includes(preferredLocation)
      ) {
        score += 2;
        reasons.push("Matches your preferred location");
      }

      // Budget = +2
      if (getBudgetMatch(service.price)) {
        score += 2;
        reasons.push("Fits your preferred budget");
      }

      // Travel style = +3
      if (getStyleMatch(service)) {
        score += 3;
        reasons.push(`Matches your ${preferences.travelStyle} travel style`);
      }

      // Duration = +1
      if (getDurationMatch(service)) {
        score += 1;
        reasons.push("Fits your trip duration");
      }

      return { score, reasons };
    };

    const maxScore = 12;

    const recommendedDestinations = destinations
      .map((destination) => {
        const { score, reasons } = calculateDestinationScore(destination);

        return {
          ...destination.toObject(),
          matchScore: Math.round((score / maxScore) * 100),
          score,
          reasons:
            reasons.length > 0
              ? reasons
              : ["Recommended based on available travel information"],
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    const recommendedServices = services
      .map((service) => {
        const { score, reasons } = calculateServiceScore(service);

        return {
          ...service.toObject(),
          matchScore: Math.round((score / maxScore) * 100),
          score,
          reasons:
            reasons.length > 0
              ? reasons
              : ["Recommended based on available travel information"],
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    res.status(200).json({
      preferences,
      destinations: recommendedDestinations,
      services: recommendedServices,
    });
  } catch (error) {
    console.error("Recommendation error:", error);

    res.status(500).json({
      message: "Failed to generate recommendations",
    });
  }
};

module.exports = {
  savePreferences,
  getPreferences,
  getRecommendations,
};
