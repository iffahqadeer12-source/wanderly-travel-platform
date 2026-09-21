const Review = require("../models/Review");

// Add Review
const addReview = async (req, res) => {
  try {
    const { destination, service, rating, reviewText, image } = req.body;

    if (!rating || !reviewText) {
      return res.status(400).json({
        message: "Rating and review text are required",
      });
    }

    if (!destination && !service) {
      return res.status(400).json({
        message: "Review must belong to a destination or service",
      });
    }

    if (destination && service) {
      return res.status(400).json({
        message: "Review cannot belong to both destination and service",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    const review = await Review.create({
  user: req.user._id,
  destination,
  service,
  rating,
  reviewText,
  image: image || "",
});
    const populatedReview = await Review.findById(review._id).populate(
      "user",
      "name email"
    );

    res.status(201).json(populatedReview);
  } catch (error) {
    res.status(500).json({
      message: "Failed to add review",
      error: error.message,
    });
  }
};

// Get Reviews
const getReviews = async (req, res) => {
  try {
    const { destination, service } = req.query;

    const filter = {};

    if (destination) {
      filter.destination = destination;
    }

    if (service) {
      filter.service = service;
    }

    const reviews = await Review.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get reviews",
      error: error.message,
    });
  }
};

// Get Review by ID
const getReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    res.json(review);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get review",
      error: error.message,
    });
  }
};

// Update Review
const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only update your own review",
      });
    }

    const { rating, reviewText, image } = req.body;

    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    if (rating !== undefined) {
      review.rating = rating;
    }

    if (reviewText !== undefined) {
      if (!reviewText.trim()) {
        return res.status(400).json({
          message: "Review text is required",
        });
      }

      review.reviewText = reviewText;
    }

    if (image !== undefined) {
      review.image = image;
    }

    await review.save();

    const updatedReview = await Review.findById(review._id).populate(
      "user",
      "name email"
    );

    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update review",
      error: error.message,
    });
  }
};

// Delete Review
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only delete your own review",
      });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.json({
      message: "Review deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete review",
      error: error.message,
    });
  }
};
// Get Rating Summary
const getRatingSummary = async (req, res) => {
  try {
    const { destination, service } = req.query;

    const filter = {};

    if (destination) {
      filter.destination = destination;
    }

    if (service) {
      filter.service = service;
    }

    const reviews = await Review.find(filter);

    const totalReviews = reviews.length;

    if (totalReviews === 0) {
      return res.json({
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: {
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0,
        },
      });
    }

    const totalRating = reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );

    const averageRating = Number(
      (totalRating / totalReviews).toFixed(1)
    );

    const ratingDistribution = {
      5: reviews.filter((review) => review.rating === 5).length,
      4: reviews.filter((review) => review.rating === 4).length,
      3: reviews.filter((review) => review.rating === 3).length,
      2: reviews.filter((review) => review.rating === 2).length,
      1: reviews.filter((review) => review.rating === 1).length,
    };

    res.json({
      averageRating,
      totalReviews,
      ratingDistribution,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get rating summary",
      error: error.message,
    });
  }
};
const markHelpful = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    review.helpfulCount += 1;

    await review.save();

    res.status(200).json({
      message: "Review marked as helpful",
      helpfulCount: review.helpfulCount,
    });
  } catch (error) {
    console.error("Helpful review error:", error);

    res.status(500).json({
      message: "Server error while marking review as helpful",
    });
  }
};
module.exports = {
  addReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
  getRatingSummary,
  markHelpful,
};