import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  MapPin,
  Star,
  Compass,
  Heart,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";
import { useAuth } from "./AuthContext.jsx";

function Recommendations() {
  const { user, token } = useAuth();

  const [preferences, setPreferences] = useState({
    budget: "Medium",
    travelStyle: "Adventure",
    preferredCategory: "Adventure",
    preferredLocation: "",
    tripDuration: 5,
  });

  const [recommendations, setRecommendations] = useState({
    destinations: [],
    services: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "/api";

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    loadPreferences();
  }, [token]);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/recommendations/preferences`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const saved = response.data;

      setPreferences({
        budget: saved.budget,
        travelStyle: saved.travelStyle,
        preferredCategory: saved.preferredCategory,
        preferredLocation: saved.preferredLocation,
        tripDuration: saved.tripDuration,
      });

      await loadRecommendations();
    } catch (error) {
      if (error.response?.status === 404) {
        setLoading(false);
        return;
      }

      console.error("Error loading preferences:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load your preferences."
      );

      setLoading(false);
    }
  };

  const loadRecommendations = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/recommendations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRecommendations({
        destinations: response.data.destinations || [],
        services: response.data.services || [],
      });
    } catch (error) {
      console.error(
        "Error loading recommendations:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load recommendations."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setPreferences((current) => ({
      ...current,
      [name]:
        name === "tripDuration"
          ? Number(value)
          : value,
    }));

    setSuccess("");
  };

  const handleSavePreferences = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !preferences.budget ||
      !preferences.travelStyle ||
      !preferences.preferredCategory ||
      !preferences.preferredLocation.trim() ||
      !preferences.tripDuration
    ) {
      setError(
        "Please complete all preference fields."
      );
      return;
    }

    if (
      preferences.tripDuration < 1 ||
      preferences.tripDuration > 60
    ) {
      setError(
        "Trip duration must be between 1 and 60 days."
      );
      return;
    }

    try {
      setSaving(true);

      await axios.post(
        `${API_URL}/recommendations/preferences`,
        preferences,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(
        "Your preferences have been saved!"
      );

      await loadRecommendations();
    } catch (error) {
      console.error(
        "Error saving preferences:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to save your preferences."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleRefresh = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    await loadRecommendations();
  };

  if (!user || !token) {
    return (
      <div className="recommendations-page">
        <div className="recommendations-empty">
          <Compass size={50} />
          <h2>Login to get personalized recommendations</h2>
          <p>
            Tell Wanderly what kind of trip you enjoy
            and we'll recommend destinations and services
            for you.
          </p>

          <Link
            to="/login"
            className="recommendations-button"
          >
            Login
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="recommendations-page">
      {/* HEADER */}
      <section className="recommendations-header">
        <div>
          <span className="eyebrow">
            PERSONALIZED FOR YOU
          </span>

          <h1>
            Find your perfect
            <br />
            <span>travel experience.</span>
          </h1>

          <p>
            Tell us what you enjoy and Wanderly will
            match you with destinations and services
            based on your preferences.
          </p>
        </div>

        <div className="recommendations-header-icon">
          <Compass size={70} />
        </div>
      </section>

      {/* PREFERENCES */}
      <section className="preferences-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              YOUR TRAVEL PROFILE
            </span>

            <h2>Travel preferences</h2>
          </div>

          <SlidersHorizontal size={25} />
        </div>

        <form
          className="preferences-form"
          onSubmit={handleSavePreferences}
        >
          <div className="preference-field">
            <label htmlFor="budget">
              Budget
            </label>

            <select
              id="budget"
              name="budget"
              value={preferences.budget}
              onChange={handleChange}
            >
              <option value="Low">
                Low
              </option>
              <option value="Medium">
                Medium
              </option>
              <option value="High">
                High
              </option>
            </select>
          </div>

          <div className="preference-field">
            <label htmlFor="travelStyle">
              Travel Style
            </label>

            <select
              id="travelStyle"
              name="travelStyle"
              value={preferences.travelStyle}
              onChange={handleChange}
            >
              <option value="Adventure">
                Adventure
              </option>
              <option value="Relaxation">
                Relaxation
              </option>
              <option value="Cultural">
                Cultural
              </option>
              <option value="Family">
                Family
              </option>
              <option value="Luxury">
                Luxury
              </option>
              <option value="Budget">
                Budget
              </option>
            </select>
          </div>

          <div className="preference-field">
            <label htmlFor="preferredCategory">
              Preferred Category
            </label>

            <select
              id="preferredCategory"
              name="preferredCategory"
              value={preferences.preferredCategory}
              onChange={handleChange}
            >
              <option value="Adventure">
                Adventure
              </option>
              <option value="Beaches">
                Beaches
              </option>
              <option value="Mountains">
                Mountains
              </option>
              <option value="Cultural">
                Cultural
              </option>
              <option value="Historical">
                Historical
              </option>
              <option value="Nature & Wildlife">
                Nature & Wildlife
              </option>
              <option value="Hotel">
                Hotel
              </option>
              <option value="Transportation">
                Transportation
              </option>
              <option value="Tour Package">
                Tour Package
              </option>
              <option value="Activity">
                Activity
              </option>
              <option value="Restaurant">
                Restaurant
              </option>
            </select>
          </div>

          <div className="preference-field">
            <label htmlFor="preferredLocation">
              Preferred Location
            </label>

            <input
              id="preferredLocation"
              name="preferredLocation"
              type="text"
              placeholder="e.g. Lahore, Pakistan"
              value={preferences.preferredLocation}
              onChange={handleChange}
            />
          </div>

          <div className="preference-field">
            <label htmlFor="tripDuration">
              Trip Duration
            </label>

            <div className="duration-input">
              <input
                id="tripDuration"
                name="tripDuration"
                type="number"
                min="1"
                max="60"
                value={preferences.tripDuration}
                onChange={handleChange}
              />

              <span>days</span>
            </div>
          </div>

          <button
            type="submit"
            className="recommendations-button"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Get My Recommendations"}

            {!saving && (
              <ArrowRight size={18} />
            )}
          </button>
        </form>

        {success && (
          <div className="recommendation-success">
            {success}
          </div>
        )}

        {error && (
          <div className="recommendation-error">
            {error}
          </div>
        )}
      </section>

      {/* RESULTS */}
      <section className="recommendations-results">
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              MATCHED FOR YOU
            </span>

            <h2>
              Recommended destinations
            </h2>
          </div>

          <button
            className="refresh-button"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw
              size={17}
              className={
                loading
                  ? "refresh-spinning"
                  : ""
              }
            />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="recommendations-empty">
            <Compass size={40} />
            <h3>
              Finding your perfect destinations...
            </h3>
            <p>
              We're matching your preferences with
              available destinations.
            </p>
          </div>
        ) : recommendations.destinations
            .length === 0 ? (
          <div className="recommendations-empty">
            <Compass size={40} />
            <h3>
              No destination recommendations yet
            </h3>
            <p>
              Save your travel preferences to receive
              personalized recommendations.
            </p>
          </div>
        ) : (
          <div className="recommendation-grid">
            {recommendations.destinations.map(
              (destination) => (
                <DestinationRecommendationCard
                  key={destination._id}
                  destination={destination}
                />
              )
            )}
          </div>
        )}
      </section>

      {/* SERVICES */}
      <section className="recommendations-results">
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              TRAVEL SERVICES
            </span>

            <h2>
              Recommended services
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="recommendations-empty">
            <h3>
              Loading recommended services...
            </h3>
          </div>
        ) : recommendations.services
            .length === 0 ? (
          <div className="recommendations-empty">
            <h3>
              No services available
            </h3>
            <p>
              There are currently no available services
              matching your travel profile.
            </p>
          </div>
        ) : (
          <div className="recommendation-grid">
            {recommendations.services.map(
              (service) => (
                <ServiceRecommendationCard
                  key={service._id}
                  service={service}
                />
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function MatchBadge({ score }) {
  return (
    <div className="match-badge">
      <strong>{score}%</strong>
      <span>Match</span>
    </div>
  );
}

function DestinationRecommendationCard({
  destination,
}) {
  return (
    <article className="recommendation-card">
      <div className="recommendation-image">
        <img
          src={destination.imageUrl}
          alt={destination.name}
        />

        <MatchBadge
          score={destination.matchScore}
        />

        <span className="recommendation-category">
          {destination.category}
        </span>
      </div>

      <div className="recommendation-content">
        <div className="recommendation-location">
          <MapPin size={15} />

          {destination.city},{" "}
          {destination.country}
        </div>

        <h3>{destination.name}</h3>

        <p>{destination.description}</p>

        <div className="recommendation-reasons">
          <strong>Why we recommend it:</strong>

          <ul>
            {destination.reasons.map(
              (reason, index) => (
                <li key={index}>
                  {reason}
                </li>
              )
            )}
          </ul>
        </div>

        <Link
          to={`/destination/${destination._id}`}
          className="recommendation-link"
        >
          Explore destination
          <ArrowRight size={17} />
        </Link>
      </div>
    </article>
  );
}

function ServiceRecommendationCard({ service }) {
  return (
    <article className="recommendation-card">
      <div className="recommendation-image">
        <img
          src={service.image}
          alt={service.name}
        />

        <MatchBadge
          score={service.matchScore}
        />

        <span className="recommendation-category">
          {service.category}
        </span>
      </div>

      <div className="recommendation-content">
        <div className="recommendation-location">
          <MapPin size={15} />
          {service.location}
        </div>

        <h3>{service.name}</h3>

        <p>{service.description}</p>

        <div className="service-price">
          Price: <strong>{service.price}</strong>
        </div>

        {service.rating > 0 && (
          <div className="service-rating">
            <Star
              size={15}
              fill="currentColor"
            />

            {service.rating.toFixed(1)}
          </div>
        )}

        <div className="recommendation-reasons">
          <strong>Why we recommend it:</strong>

          <ul>
            {service.reasons.map(
              (reason, index) => (
                <li key={index}>
                  {reason}
                </li>
              )
            )}
          </ul>
        </div>

        <Link
          to={`/service/${service._id}`}
          className="recommendation-link"
        >
          View service
          <ArrowRight size={17} />
        </Link>
      </div>
    </article>
  );
}

export default Recommendations;
