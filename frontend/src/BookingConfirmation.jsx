import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  CheckCircle,
  Calendar,
  Users,
  MapPin,
  ArrowLeft,
} from "lucide-react";

function BookingConfirmation() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const token = localStorage.getItem("wanderlyToken");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `${API_URL}/bookings/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setBooking(response.data);
      } catch (error) {
        console.error("Error fetching booking:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load booking."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [API_URL, id, navigate]);

  if (loading) {
    return (
      <div className="booking-confirmation-page">
        <h2>Loading booking...</h2>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="booking-confirmation-page">
        <h2>{error || "Booking not found."}</h2>

        <Link to="/services">
          Back to Services
        </Link>
      </div>
    );
  }

  return (
    <div className="booking-confirmation-page">
      <div className="confirmation-container">

        <CheckCircle
          size={70}
          className="confirmation-icon"
        />

        <h1>Booking Confirmed!</h1>

        <p className="confirmation-message">
          Your travel service booking has been
          successfully created.
        </p>

        <div className="confirmation-card">

          <h2>{booking.service?.name}</h2>

          <p className="confirmation-location">
            <MapPin size={18} />
            {booking.service?.location}
          </p>

          <div className="confirmation-info">

            <div>
              <Calendar size={20} />
              <span>
                <strong>Booking Date</strong>
                <br />
                {new Date(
                  booking.bookingDate
                ).toLocaleDateString()}
              </span>
            </div>

            <div>
              <Users size={20} />
              <span>
                <strong>People</strong>
                <br />
                {booking.numberOfPeople}
              </span>
            </div>

          </div>

          <div className="confirmation-booking-id">
            <span>Booking ID</span>
            <strong>{booking.bookingId}</strong>
          </div>

          <div className="confirmation-total">
            <span>Total Price</span>
            <strong>
              Rs. {booking.totalPrice.toLocaleString()}
            </strong>
          </div>

          <div className="confirmation-status">
            <span>Status</span>
            <strong>{booking.status}</strong>
          </div>

        </div>

        <div className="confirmation-actions">

          <button
            onClick={() => navigate("/trips")}
            className="confirmation-button"
          >
            View My Trips
          </button>

          <button
            onClick={() => navigate("/services")}
            className="confirmation-button secondary"
          >
            Explore More Services
          </button>

        </div>

      </div>
    </div>
  );
}

export default BookingConfirmation;
