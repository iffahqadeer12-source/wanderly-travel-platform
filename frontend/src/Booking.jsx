import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Calendar, Users, ArrowLeft } from "lucide-react";

function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [specialRequest, setSpecialRequest] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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
        setError("Unable to load service.");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [API_URL, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const token = localStorage.getItem("wanderlyToken");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!bookingDate) {
      setError("Please select a booking date.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await axios.post(
        `${API_URL}/bookings`,
        {
          service: id,
          bookingDate,
          numberOfPeople,
          specialRequest,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate(
        `/booking-confirmation/${response.data.booking._id}`
      );
    } catch (error) {
      console.error("Booking error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to create booking."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="booking-page">
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="booking-page">
        <h2>{error || "Service not found."}</h2>
      </div>
    );
  }

  const totalPrice =
    service.price * Number(numberOfPeople);

  return (
    <div className="booking-page">
      <div className="booking-container">

        <button
          className="back-button"
          onClick={() =>
            navigate(`/service/${service._id}`)
          }
        >
          <ArrowLeft size={18} />
          Back to Service
        </button>

        <div className="booking-layout">

          <div className="booking-form-card">
            <h1>Book Your Experience</h1>

            <p>
              Complete the form below to book{" "}
              <strong>{service.name}</strong>.
            </p>

            {error && (
              <div className="booking-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              <label>
                <Calendar size={18} />
                Booking Date
              </label>

              <input
                type="date"
                value={bookingDate}
                onChange={(e) =>
                  setBookingDate(e.target.value)
                }
                min={
                  new Date()
                    .toISOString()
                    .split("T")[0]
                }
                required
              />

              <label>
                <Users size={18} />
                Number of People
              </label>

              <input
                type="number"
                min="1"
                value={numberOfPeople}
                onChange={(e) =>
                  setNumberOfPeople(
                    Number(e.target.value)
                  )
                }
                required
              />

              <label>
                Special Request
              </label>

              <textarea
                value={specialRequest}
                onChange={(e) =>
                  setSpecialRequest(e.target.value)
                }
                placeholder="Any special requests?"
                rows="5"
              />

              <button
                type="submit"
                className="confirm-booking-button"
                disabled={submitting}
              >
                {submitting
                  ? "Creating Booking..."
                  : "Confirm Booking"}
              </button>

            </form>
          </div>

          <div className="booking-summary-card">

            <img
              src={service.image}
              alt={service.name}
            />

            <h2>{service.name}</h2>

            <p>{service.location}</p>

            <div className="booking-summary-row">
              <span>Price per person</span>
              <strong>
                Rs. {service.price.toLocaleString()}
              </strong>
            </div>

            <div className="booking-summary-row">
              <span>People</span>
              <strong>{numberOfPeople}</strong>
            </div>

            <hr />

            <div className="booking-total">
              <span>Total</span>
              <strong>
                Rs. {totalPrice.toLocaleString()}
              </strong>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Booking;
