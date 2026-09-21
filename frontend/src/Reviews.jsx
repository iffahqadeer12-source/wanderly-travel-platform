import { useEffect, useState } from "react";
import axios from "axios";
import { Star, Trash2, Edit3, Send, ThumbsUp } from "lucide-react";
import { useAuth } from "./AuthContext.jsx";

const API_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/reviews`
  : "http://localhost:5000/api/reviews";

function Reviews({ destinationId = null, serviceId = null }) {
  const { user, token } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    },
  });

  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewImage, setReviewImage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [filterRating, setFilterRating] = useState("all");


  const query = destinationId
    ? `?destination=${destinationId}`
    : `?service=${serviceId}`;

  const loadReviews = async () => {
    try {
      const reviewsResponse = await axios.get(`${API_URL}${query}`);
      setReviews(reviewsResponse.data);

      const summaryResponse = await axios.get(
        `${API_URL}/summary${query}`
      );

      setSummary(summaryResponse.data);
    } catch (error) {
      console.error("Failed to load reviews:", error);
    }
  };

  useEffect(() => {
    if (destinationId || serviceId) {
      loadReviews();
    }
  }, [destinationId, serviceId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !token) {
      setMessage("Please login to submit a review.");
      return;
    }

    if (!reviewText.trim()) {
      setMessage("Please write a review.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      if (editingId) {
        await axios.put(
          `${API_URL}/${editingId}`,
          {
            rating,
            reviewText,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMessage("Review updated successfully.");
      } else {
        const body = {
  rating,
  reviewText,
  image: reviewImage,
};

        if (destinationId) {
          body.destination = destinationId;
        }

        if (serviceId) {
          body.service = serviceId;
        }

        await axios.post(API_URL, body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMessage("Review submitted successfully.");
      }

      setRating(5);
      setReviewText("");
      setReviewImage("");
      setEditingId(null);

      await loadReviews();
    } catch (error) {
      console.error("Review error:", error);

      setMessage(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (review) => {
    setEditingId(review._id);
    setRating(review.rating);
    setReviewText(review.reviewText);

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("Review deleted successfully.");
      await loadReviews();
    } catch (error) {
      console.error("Delete review error:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to delete review."
      );
    }
  };
const filteredReviews =
  filterRating === "all"
    ? reviews
    : reviews.filter(
        (review) => review.rating === Number(filterRating)
      );

  const handleHelpful = async (id) => {
  try {
    await axios.put(`${API_URL}/${id}/helpful`);

    setMessage("Thanks for your feedback!");

    await loadReviews();
  } catch (error) {
    console.error("Helpful review error:", error);

    setMessage(
      error.response?.data?.message ||
        "Failed to mark review as helpful."
    );
  }
};

  return (
    <section className="reviews-section">
      <div className="reviews-container">
        <div className="reviews-header">
          <div>
            <p className="section-label">TRAVELER REVIEWS</p>

            <h2>
              Reviews & <span>Ratings</span>
            </h2>

            <p className="reviews-subtitle">
              See what other travelers think about this experience.
            </p>
          </div>
        </div>

        {/* Rating Summary */}
        <div className="rating-summary">
          <div className="average-rating">
            <div className="average-number">
              {summary.averageRating.toFixed(1)}
            </div>

            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={20}
                  fill={
                    star <= Math.round(summary.averageRating)
                      ? "currentColor"
                      : "none"
                  }
                />
              ))}
            </div>

            <p>
              {summary.totalReviews}{" "}
              {summary.totalReviews === 1 ? "Review" : "Reviews"}
            </p>
          </div>

          <div className="rating-distribution">
            {[5, 4, 3, 2, 1].map((star) => {
              const count =
                summary.ratingDistribution?.[star] || 0;

              const percentage =
                summary.totalReviews > 0
                  ? (count / summary.totalReviews) * 100
                  : 0;

              return (
                <div className="rating-row" key={star}>
                  <span>{star}</span>

                  <Star
                    size={15}
                    fill="currentColor"
                  />

                  <div className="rating-bar">
                    <div
                      className="rating-bar-fill"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>

                  <span>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="review-filters">
  <button
    type="button"
    className={filterRating === "all" ? "active" : ""}
    onClick={() => setFilterRating("all")}
  >
    All
  </button>

  {[5, 4, 3, 2, 1].map((star) => (
    <button
      type="button"
      key={star}
      className={
        filterRating === String(star) ? "active" : ""
      }
      onClick={() => setFilterRating(String(star))}
    >
      {star} ★
    </button>
  ))}
</div>
        {/* Reviews */}
        <div className="reviews-list">
          {reviews.length === 0 ? (
            <div className="no-reviews">
              <h3>No reviews yet</h3>
              <p>Be the first traveler to leave a review.</p>
            </div>
          ) : (
            filteredReviews.map((review) => {
              const isOwner =
  user &&
  review.user &&
  String(review.user._id) === String(user.id);

              return (
                <div className="review-card" key={review._id}>
                  <div className="review-card-top">
                    <div className="review-user">
                      <div className="review-avatar">
                        {review.user?.name
                          ?.charAt(0)
                          ?.toUpperCase() || "U"}
                      </div>

                      <div>
                        <h4>
                          {review.user?.name || "Traveler"}
                        </h4>

                        <p>
                          {new Date(
                            review.createdAt
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="review-stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={16}
                          fill={
                            star <= review.rating
                              ? "currentColor"
                              : "none"
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <p className="review-text">
                    {review.reviewText}
                  </p>

                  <div className="review-actions">
                    <button
                      type="button"
                      onClick={() =>
                        handleHelpful(review._id)
                      }
                    >
                      <ThumbsUp size={15} />
                      Helpful ({review.helpfulCount || 0})
                    </button>

                    {isOwner && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleEdit(review)}
                        >
                          <Edit3 size={15} />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(review._id)
                          }
                        >
                          <Trash2 size={15} />
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Review Form */}
        <div className="review-form-wrapper">
          <h3>
            {editingId
              ? "Edit Your Review"
              : "Write a Review"}
          </h3>

          {!user ? (
            <p className="login-review-message">
              Please login to write a review.
            </p>
          ) : (
            <form
              className="review-form"
              onSubmit={handleSubmit}
            >
              <div className="form-rating">
                <label>Your Rating</label>

                <div className="rating-selector">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className={
                        star <= rating
                          ? "selected"
                          : ""
                      }
                    >
                      <Star
                        size={25}
                        fill={
                          star <= rating
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reviewText">
                  Your Review
                </label>

                <textarea
                  id="reviewText"
                  value={reviewText}
                  onChange={(e) =>
                    setReviewText(e.target.value)
                  }
                  placeholder="Share your travel experience..."
                  rows="5"
                  required
                />
              </div>
              <div className="form-group">
  <label htmlFor="reviewImage">
    Image URL (Optional)
  </label>

  <input
    type="url"
    id="reviewImage"
    value={reviewImage}
    onChange={(e) => setReviewImage(e.target.value)}
    placeholder="https://example.com/your-image.jpg"
  />
</div>

              <button
                type="submit"
                className="review-submit-btn"
                disabled={loading}
              >
                <Send size={17} />

                {loading
                  ? "Submitting..."
                  : editingId
                  ? "Update Review"
                  : "Submit Review"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="cancel-edit-btn"
                  onClick={() => {
                    setEditingId(null);
                    setRating(5);
                    setReviewText("");
                  }}
                >
                  Cancel Edit
                </button>
              )}
            </form>
          )}

          {message && (
            <p className="review-message">
              {message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default Reviews;
