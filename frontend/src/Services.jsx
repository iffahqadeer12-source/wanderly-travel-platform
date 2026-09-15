import { useEffect, useState } from "react";
import axios from "axios";
import { MapPin, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/services`
        );

        setServices(response.data.services || []);
      } catch (error) {
        console.error("Error fetching services:", error);
        setError("Unable to load travel services.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [API_URL]);

  if (loading) {
    return (
      <div className="services-page">
        <h2>Loading travel services...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="services-page">
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <div className="services-page">
      <section className="services-hero">
        <h1>Travel Services</h1>
        <p>
          Discover hotels, tours, transportation,
          activities, and restaurants for your perfect trip.
        </p>
      </section>

      <section className="services-section">
        <div className="services-grid">
          {services.map((service) => (
            <div className="service-card" key={service._id}>
              <img
                src={service.image}
                alt={service.name}
                className="service-image"
              />

              <div className="service-content">
                <span className="service-category">
                  {service.category}
                </span>

                <h2>{service.name}</h2>

                <p className="service-location">
                  <MapPin size={16} />
                  {service.location}
                </p>

                <p className="service-description">
                  {service.description}
                </p>

                <div className="service-info">
                  <span className="service-rating">
                    <Star size={16} fill="currentColor" />
                    {service.rating}
                  </span>

                  <span className="service-price">
                    Rs. {service.price.toLocaleString()}
                  </span>
                </div>

                <Link
                  to={`/service/${service._id}`}
                  className="service-button"
                >
                  View Details
                  <ArrowRight size={17} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Services;
