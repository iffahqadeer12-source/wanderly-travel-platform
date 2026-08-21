const User = require("../models/User");

// GET PROFILE
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("favorites", "name country city imageUrl category")
      .populate("recentlyViewed", "name country city imageUrl category");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Get profile error:", error);

    res.status(500).json({
      message: "Server error while getting profile",
    });
  }
};

// UPDATE PROFILE
const updateProfile = async (req, res) => {
  try {
    const { name, profileImage, bio } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (name !== undefined) {
      user.name = name;
    }

    if (profileImage !== undefined) {
      user.profileImage = profileImage;
    }

    if (bio !== undefined) {
      user.bio = bio;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profileImage: updatedUser.profileImage,
        bio: updatedUser.bio,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);

    res.status(500).json({
      message: "Server error while updating profile",
    });
  }
};

// ADD TO FAVORITES
const addFavorite = async (req, res) => {
  try {
    const { destinationId } = req.params;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.favorites.includes(destinationId)) {
      return res.status(400).json({
        message: "Destination already in favorites",
      });
    }

    user.favorites.push(destinationId);

    await user.save();

    const updatedUser = await User.findById(req.user._id)
      .select("-password")
      .populate(
        "favorites",
        "name country city imageUrl category description"
      );

    res.status(200).json({
      message: "Destination added to favorites",
      favorites: updatedUser.favorites,
    });
  } catch (error) {
    console.error("Add favorite error:", error);

    res.status(500).json({
      message: "Server error while adding favorite",
    });
  }
};

// REMOVE FROM FAVORITES
const removeFavorite = async (req, res) => {
  try {
    const { destinationId } = req.params;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.favorites = user.favorites.filter(
      (id) => id.toString() !== destinationId
    );

    await user.save();

    const updatedUser = await User.findById(req.user._id)
      .select("-password")
      .populate(
        "favorites",
        "name country city imageUrl category description"
      );

    res.status(200).json({
      message: "Destination removed from favorites",
      favorites: updatedUser.favorites,
    });
  } catch (error) {
    console.error("Remove favorite error:", error);

    res.status(500).json({
      message: "Server error while removing favorite",
    });
  }
};

// GET FAVORITES
const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate(
        "favorites",
        "name country city imageUrl category description"
      );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      favorites: user.favorites,
    });
  } catch (error) {
    console.error("Get favorites error:", error);

    res.status(500).json({
      message: "Server error while getting favorites",
    });
  }
};
// ADD TO RECENTLY VIEWED
const addRecentlyViewed = async (req, res) => {
  try {
    const { destinationId } = req.params;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Remove destination if it already exists
    user.recentlyViewed = user.recentlyViewed.filter(
      (id) => id.toString() !== destinationId
    );

    // Add it to the beginning
    user.recentlyViewed.unshift(destinationId);

    // Keep only the latest 5
    user.recentlyViewed = user.recentlyViewed.slice(0, 5);

    await user.save();

    const updatedUser = await User.findById(req.user._id)
      .select("-password")
      .populate(
        "recentlyViewed",
        "name country city imageUrl category description"
      );

    res.status(200).json({
      message: "Destination added to recently viewed",
      recentlyViewed: updatedUser.recentlyViewed,
    });
  } catch (error) {
    console.error("Recently viewed error:", error);

    res.status(500).json({
      message: "Server error while updating recently viewed",
    });
  }
};

// GET RECENTLY VIEWED
const getRecentlyViewed = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate(
        "recentlyViewed",
        "name country city imageUrl category description"
      );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      recentlyViewed: user.recentlyViewed,
    });
  } catch (error) {
    console.error("Get recently viewed error:", error);

    res.status(500).json({
      message: "Server error while getting recently viewed",
    });
  }
};

// EXPORT ALL FUNCTIONS
module.exports = {
  getProfile,
  updateProfile,
  addFavorite,
  removeFavorite,
  getFavorites,
  addRecentlyViewed,
  getRecentlyViewed,
};
