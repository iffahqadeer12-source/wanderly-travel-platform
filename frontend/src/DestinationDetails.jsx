import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import axios from "axios";
import { ArrowLeft, MapPin, Star } from "lucide-react";

function DestinationDetails() {
  const { id } = useParams();
  const { token } = useAuth();

  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        setLoading(true);

        const API_URL =
          import.meta.env.VITE_API_URL || "/api";

        console.log(
          "Fetching destination from:",
          `${API_URL}/destinations/${id}`
        );

        const response = await axios.get(
          `${API_URL}/destinations/${id}`
        );

        console.log(
          "Destination response:",
          response.data
        );

        setDestination(response.data);
setError("");

// Add destination to recently viewed if user is logged in
if (token) {
  try {
    await axios.post(
      `${API_URL}/users/recently-viewed/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Added to recently viewed");
  } catch (error) {
    console.error(
      "Could not update recently viewed:",
      error
    );
  }
}

      } catch (error) {
        console.error(
          "Error fetching destination:",
          error
        );

        console.error(
          "Error response:",
          error.response
        );

        setError("Unable to load destination.");
      } finally {
        setLoading(false);
      }
    };

    fetchDestination();
  }, [id, token]);
  

  if (loading) {
    return (
      <div className="details-message">
        <h2>Loading destination...</h2>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="details-message">
        <h2>
          {error || "Destination not found."}
        </h2>

        <Link
          to="/"
          className="back-button"
        >
          <ArrowLeft size={18} />
          Back to destinations
        </Link>
      </div>
    );
  }

  return (
    <div className="destination-details-page">
      <Link
        to="/"
        className="back-button"
      >
        <ArrowLeft size={18} />
        Back to Wanderly
      </Link>

      <div className="details-image">
        <img
          src={destination.imageUrl}
          alt={destination.name}
        />
      </div>

      <div className="details-content">
        <span className="eyebrow">
          {destination.category}
        </span>

        <h1>{destination.name}</h1>

        <div className="details-location">
          <MapPin size={18} />
          {destination.city},{" "}
          {destination.country}
        </div>

        <p className="details-description">
          {destination.description}
        </p>

        <div className="details-info">
          <div className="info-card">
            <Star size={20} />

            <strong>
              {destination.rating || 0}
            </strong>

            <span>Rating</span>
          </div>

          <div className="info-card">
            <strong>
              {destination.popularity ||
                "Medium"}
            </strong>

            <span>Popularity</span>
          </div>
        </div>

        <button className="primary-button">
          Explore this destination
        </button>
      </div>
    </div>
  );
}

export default DestinationDetails;
