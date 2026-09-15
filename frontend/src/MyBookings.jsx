import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Calendar, Users, MapPin } from "lucide-react";

function MyBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("wanderlyToken");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `${API_URL}/bookings`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setBookings(response.data.bookings || []);
      } catch (error) {
        console.error("Error fetching bookings:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load your bookings."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [API_URL, navigate]);

  if (loading) {
    return (
      <div className="my-bookings-page">
        <h2>Loading your bookings...</h2>
      </div>
    );
  }

  return (
    <div className="my-bookings-page">
      <div className="my-bookings-container">

        <div className="my-bookings-header">
          <h1>My Bookings</h1>

          <p>
            View and manage your travel service bookings.
          </p>
        </div>

        {error && (
          <div className="booking-error">
            {error}
          </div>
        )}

        {!error && bookings.length === 0 && (
          <div className="no-bookings">
            <h2>No bookings yet</h2>

            <p>
              You haven't booked any travel services yet.
            </p>

            <button
              onClick={() => navigate("/services")}
              className="confirmation-button"
            >
              Explore Services
            </button>
          </div>
        )}

        <div className="bookings-list">

          {bookings.map((booking) => (
            <div
              className="booking-history-card"
              key={booking._id}
            >

              <img
                src={booking.service?.image}
                alt={booking.service?.name}
              />

              <div className="booking-history-content">

                <div className="booking-history-top">

                  <div>
                    <span className="service-category">
                      {booking.service?.category}
                    </span>

                    <h2>
                      {booking.service?.name}
                    </h2>

                    <p className="service-location">
                      <MapPin size={16} />
                      {booking.service?.location}
                    </p>
                  </div>

                  <span
                    className={`booking-status ${booking.status.toLowerCase()}`}
                  >
                    {booking.status}
                  </span>

                </div>

                <div className="booking-history-info">

                  <div>
                    <Calendar size={18} />

                    <span>
                      <strong>Date</strong>
                      <br />
                      {new Date(
                        booking.bookingDate
                      ).toLocaleDateString()}
                    </span>
                  </div>

                  <div>
                    <Users size={18} />

                    <span>
                      <strong>People</strong>
                      <br />
                      {booking.numberOfPeople}
                    </span>
                  </div>

                  <div>
                    <span>
                      <strong>Booking ID</strong>
                      <br />
                      {booking.bookingId}
                    </span>
                  </div>

                  <div>
                    <span>
                      <strong>Total</strong>
                      <br />
                      Rs.{" "}
                      {booking.totalPrice.toLocaleString()}
                    </span>
                  </div>

                </div>

                <button
                  className="view-booking-button"
                  onClick={() =>
                    navigate(
                      `/booking-confirmation/${booking._id}`
                    )
                  }
                >
                  View Booking
                </button>

              </div>

            </div>
          ))}

        </div>

      </div>
    </div>
  );
}

export default MyBookings;
