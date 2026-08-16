import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, MapPin, Star } from "lucide-react";

function DestinationDetails() {
  const { id } = useParams();

  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const response = await axios.get(`/api/destinations/${id}`);
        setDestination(response.data);
      } catch (error) {
        console.error("Error fetching destination:", error);
        setError("Unable to load destination.");
      } finally {
        setLoading(false);
      }
    };

    fetchDestination();
  }, [id]);

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
        <h2>{error || "Destination not found."}</h2>
        <Link to="/" className="back-button">
          <ArrowLeft size={18} />
          Back to destinations
        </Link>
      </div>
    );
  }

  return (
    <div className="destination-details-page">
      <Link to="/" className="back-button">
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
          {destination.city}, {destination.country}
        </div>

        <p className="details-description">
          {destination.description}
        </p>

        <div className="details-info">
          <div className="info-card">
            <Star size={20} />
            <strong>{destination.rating || 0}</strong>
            <span>Rating</span>
          </div>

          <div className="info-card">
            <strong>{destination.popularity || "Medium"}</strong>
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

