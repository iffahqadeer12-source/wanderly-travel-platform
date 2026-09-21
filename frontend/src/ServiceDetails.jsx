import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  MapPin,
  Star,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import Reviews from "./Reviews.jsx";

function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/services/${id}`
        );

        setService(response.data);
      } catch (error) {
        console.error("Error fetching service:", error);
        setError("Unable to load service details.");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [API_URL, id]);

  if (loading) {
    return (
      <div className="service-details-page">
        <h2>Loading service...</h2>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="service-details-page">
        <h2>{error || "Service not found."}</h2>

        <Link to="/services">
          Back to Services
        </Link>
      </div>
    );
  }

  return (
    <div className="service-details-page">

      <div className="service-details-container">

        <button
          className="back-button"
          onClick={() => navigate("/services")}
        >
          <ArrowLeft size={18} />
          Back to Services
        </button>

        <div className="service-details-card">

          <img
            src={service.image}
            alt={service.name}
            className="service-details-image"
          />

          <div className="service-details-content">

            <span className="service-category">
              {service.category}
            </span>

            <h1>{service.name}</h1>

            <p className="service-location">
              <MapPin size={18} />
              {service.location}
            </p>

            <div className="service-rating-large">
              <Star size={20} fill="currentColor" />
              {service.rating} / 5
            </div>

            <p className="service-details-description">
              {service.description}
            </p>

            <div className="service-features">
              <h3>Features</h3>

              {service.features.map((feature, index) => (
                <div
                  className="feature-item"
                  key={index}
                >
                  <CheckCircle size={18} />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <div className="service-booking-box">

              <div>
                <span>Starting from</span>

                <strong>
                  Rs. {service.price.toLocaleString()}
                </strong>
              </div>

              <button
                className="book-now-button"
                onClick={() =>
                  navigate(`/book/${service._id}`)
                }
                disabled={!service.availability}
              >
                {service.availability
                  ? "Book Now"
                  : "Currently Unavailable"}
              </button>

            </div>

          </div>

                </div>

        <Reviews serviceId={service._id} />

      </div>

    </div>
  );
}

export default ServiceDetails;
