import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Trash2,
  MapPin,
  CalendarDays,
  Users,
  Clock,
  Star,
} from "lucide-react";
import { useAuth } from "./AuthContext.jsx";

function TripPlanner() {
  const { token } = useAuth();

  const API_URL =
    import.meta.env.VITE_API_URL || "/api";

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [favoriteTrips, setFavoriteTrips] = useState(() => {
    const savedFavorites =
      localStorage.getItem("wanderlyFavoriteTrips");

    return savedFavorites
      ? JSON.parse(savedFavorites)
      : [];
  });

  const [tripForm, setTripForm] = useState({
    tripName: "",
    destination: "",
    startDate: "",
    endDate: "",
    travelers: 1,
    description: "",
  });

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // ===============================
  // GET USER TRIPS
  // ===============================

  const fetchTrips = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/trips`,
        authConfig
      );

      setTrips(response.data.trips || []);
    } catch (err) {
      console.error("Get trips error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load your trips."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTrips();
    } else {
      setLoading(false);
    }
  }, [token]);

  // ===============================
  // SAVE FAVORITES
  // ===============================

  useEffect(() => {
    localStorage.setItem(
      "wanderlyFavoriteTrips",
      JSON.stringify(favoriteTrips)
    );
  }, [favoriteTrips]);

  // ===============================
  // TOGGLE FAVORITE
  // ===============================

  const toggleFavorite = (tripId) => {
    setFavoriteTrips((prev) => {
      if (prev.includes(tripId)) {
        setMessage("Removed from favorites.");
        return prev.filter(
          (id) => id !== tripId
        );
      }

      setMessage("Added to favorites! ⭐");

      return [...prev, tripId];
    });
  };

  // ===============================
  // CREATE TRIP
  // ===============================

  const handleCreateTrip = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (
      !tripForm.tripName ||
      !tripForm.destination ||
      !tripForm.startDate ||
      !tripForm.endDate
    ) {
      setError(
        "Please fill in all required fields."
      );
      return;
    }

    if (
      new Date(tripForm.endDate) <
      new Date(tripForm.startDate)
    ) {
      setError(
        "End date cannot be before start date."
      );
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/trips`,
        {
          ...tripForm,
          travelers: Number(tripForm.travelers),
        },
        authConfig
      );

      setTrips((prev) => [
        response.data.trip,
        ...prev,
      ]);

      setMessage(
        "Trip created successfully! 🎉"
      );

      setTripForm({
        tripName: "",
        destination: "",
        startDate: "",
        endDate: "",
        travelers: 1,
        description: "",
      });

      setShowCreateForm(false);
    } catch (err) {
      console.error(
        "Create trip error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to create trip."
      );
    }
  };

  // ===============================
  // DELETE TRIP
  // ===============================

  const handleDeleteTrip = async (tripId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this trip?"
    );

    if (!confirmed) return;

    try {
      await axios.delete(
        `${API_URL}/trips/${tripId}`,
        authConfig
      );

      setTrips((prev) =>
        prev.filter(
          (trip) => trip._id !== tripId
        )
      );

      setFavoriteTrips((prev) =>
        prev.filter(
          (id) => id !== tripId
        )
      );

      setMessage(
        "Trip deleted successfully."
      );
    } catch (err) {
      console.error(
        "Delete trip error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to delete trip."
      );
    }
  };

  // ===============================
  // DATE FORMAT
  // ===============================

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  };

  // ===============================
  // CALCULATE DAYS
  // ===============================

  const calculateDays = (
    startDate,
    endDate
  ) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const difference =
      end.getTime() - start.getTime();

    return (
      Math.floor(
        difference /
          (1000 * 60 * 60 * 24)
      ) + 1
    );
  };

  // ===============================
  // DASHBOARD CALCULATIONS
  // ===============================

  const upcomingTrips = trips.filter(
    (trip) =>
      new Date(trip.startDate) >=
      new Date()
  );

  const completedTrips = trips.filter(
    (trip) =>
      new Date(trip.endDate) <
      new Date()
  );

  const totalPlannedDays = trips.reduce(
    (total, trip) =>
      total +
      calculateDays(
        trip.startDate,
        trip.endDate
      ),
    0
  );

  const favoriteTripList = trips.filter(
    (trip) =>
      favoriteTrips.includes(trip._id)
  );

  // ===============================
  // LOGIN CHECK
  // ===============================

  if (!token) {
    return (
      <div className="trip-page">
        <div className="trip-message">

          <h2>
            Please login to plan a trip.
          </h2>

          <Link
            to="/login"
            className="primary-button"
          >
            Login
          </Link>

        </div>
      </div>
    );
  }

  // ===============================
  // MAIN PAGE
  // ===============================

  return (
    <div className="trip-page">

      {/* ===============================
          HEADER
      =============================== */}

      <div className="trip-header">

        <Link
          to="/"
          className="back-button"
        >
          <ArrowLeft size={18} />
          Back to Wanderly
        </Link>

        <div className="trip-title">

          <span className="eyebrow">
            YOUR JOURNEY
          </span>

          <h1>
            Trip Planner
          </h1>

          <p>
            Plan your perfect adventure
            day by day.
          </p>

        </div>

        <button
          className="primary-button"
          onClick={() =>
            setShowCreateForm(
              !showCreateForm
            )
          }
        >
          <Plus size={18} />
          Create Trip
        </button>

      </div>

      {/* ===============================
          MESSAGES
      =============================== */}

      {message && (
        <div className="success-message">
          {message}
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* ===============================
          CREATE TRIP FORM
      =============================== */}

      {showCreateForm && (
        <section className="create-trip-card">

          <h2>
            Create a new trip
          </h2>

          <form
            onSubmit={handleCreateTrip}
          >

            <div className="form-grid">

              <div className="form-group">

                <label>
                  Trip Name *
                </label>

                <input
                  type="text"
                  placeholder="e.g. Paris Adventure"
                  value={
                    tripForm.tripName
                  }
                  onChange={(e) =>
                    setTripForm({
                      ...tripForm,
                      tripName:
                        e.target.value,
                    })
                  }
                />

              </div>

              <div className="form-group">

                <label>
                  Destination *
                </label>

                <input
                  type="text"
                  placeholder="e.g. Paris, France"
                  value={
                    tripForm.destination
                  }
                  onChange={(e) =>
                    setTripForm({
                      ...tripForm,
                      destination:
                        e.target.value,
                    })
                  }
                />

              </div>

              <div className="form-group">

                <label>
                  Start Date *
                </label>

                <input
                  type="date"
                  value={
                    tripForm.startDate
                  }
                  onChange={(e) =>
                    setTripForm({
                      ...tripForm,
                      startDate:
                        e.target.value,
                    })
                  }
                />

              </div>

              <div className="form-group">

                <label>
                  End Date *
                </label>

                <input
                  type="date"
                  value={
                    tripForm.endDate
                  }
                  onChange={(e) =>
                    setTripForm({
                      ...tripForm,
                      endDate:
                        e.target.value,
                    })
                  }
                />

              </div>

              <div className="form-group">

                <label>
                  Number of Travelers *
                </label>

                <input
                  type="number"
                  min="1"
                  value={
                    tripForm.travelers
                  }
                  onChange={(e) =>
                    setTripForm({
                      ...tripForm,
                      travelers:
                        e.target.value,
                    })
                  }
                />

              </div>

              <div className="form-group full-width">

                <label>
                  Description
                </label>

                <textarea
                  placeholder="Tell us about your trip..."
                  value={
                    tripForm.description
                  }
                  onChange={(e) =>
                    setTripForm({
                      ...tripForm,
                      description:
                        e.target.value,
                    })
                  }
                />

              </div>

            </div>

            <div className="form-actions">

              <button
                type="button"
                className="secondary-button"
                onClick={() =>
                  setShowCreateForm(false)
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
              >
                <Plus size={18} />
                Create Trip
              </button>

            </div>

          </form>

        </section>
      )}

      {/* ===============================
          TRIP DASHBOARD
      =============================== */}

      <section className="trip-dashboard">

        <div className="dashboard-heading">

          <div>

            <span className="eyebrow">
              TRIP DASHBOARD
            </span>

            <h2>
              Your travel overview
            </h2>

            <p>
              Keep track of your upcoming
              adventures and planned journeys.
            </p>

          </div>

        </div>

        <div className="dashboard-grid">

          {/* TOTAL */}

          <div className="dashboard-card">

            <div className="dashboard-icon">
              <CalendarDays size={22} />
            </div>

            <div>

              <span>
                Total Trips
              </span>

              <strong>
                {trips.length}
              </strong>

            </div>

          </div>

          {/* UPCOMING */}

          <div className="dashboard-card">

            <div className="dashboard-icon">
              <MapPin size={22} />
            </div>

            <div>

              <span>
                Upcoming Trips
              </span>

              <strong>
                {upcomingTrips.length}
              </strong>

            </div>

          </div>

          {/* COMPLETED */}

          <div className="dashboard-card">

            <div className="dashboard-icon">
              <Clock size={22} />
            </div>

            <div>

              <span>
                Completed Trips
              </span>

              <strong>
                {completedTrips.length}
              </strong>

            </div>

          </div>

          {/* PLANNED DAYS */}

          <div className="dashboard-card">

            <div className="dashboard-icon">
              <Users size={22} />
            </div>

            <div>

              <span>
                Total Planned Days
              </span>

              <strong>
                {totalPlannedDays}
              </strong>

            </div>

          </div>

        </div>

      </section>

      {/* ===============================
          FAVORITE TRIPS
      =============================== */}

      {favoriteTripList.length > 0 && (

        <section className="trips-section">

          <div className="section-heading">

            <div>

              <span className="eyebrow">
                FAVORITES
              </span>

              <h2>
                Your favorite trips
              </h2>

              <p>
                Quick access to the trips
                you love most.
              </p>

            </div>

            <span className="destination-count">
              {favoriteTripList.length} favorites
            </span>

          </div>

          <div className="trip-grid">

            {favoriteTripList.map(
              (trip) => (

                <article
                  className="trip-card"
                  key={trip._id}
                >

                  <div className="trip-card-top">

                    <span className="trip-status">
                      {trip.status}
                    </span>

                    <button
                      className="delete-trip"
                      onClick={() =>
                        toggleFavorite(
                          trip._id
                        )
                      }
                      title="Remove favorite"
                    >
                      <Star
                        size={18}
                        fill="currentColor"
                      />
                    </button>

                  </div>

                  <h3>
                    {trip.tripName}
                  </h3>

                  <div className="trip-detail">

                    <MapPin size={17} />

                    <span>
                      {trip.destination}
                    </span>

                  </div>

                  <div className="trip-detail">

                    <CalendarDays size={17} />

                    <span>
                      {formatDate(
                        trip.startDate
                      )}{" "}
                      —{" "}
                      {formatDate(
                        trip.endDate
                      )}
                    </span>

                  </div>

                  <Link
                    to={`/trip/${trip._id}`}
                    className="primary-button trip-open-button"
                  >
                    Open Trip
                  </Link>

                </article>

              )
            )}

          </div>

        </section>

      )}

      {/* ===============================
          RECENT TRIPS
      =============================== */}

      <section className="trips-section">

        <div className="section-heading">

          <div>

            <span className="eyebrow">
              RECENT TRIPS
            </span>

            <h2>
              Your adventures
            </h2>

            <p>
              Your latest planned journeys.
            </p>

          </div>

          <span className="destination-count">
            {trips.length} trips
          </span>

        </div>

        {/* LOADING */}

        {loading ? (

          <div className="trip-message">

            <h3>
              Loading your trips...
            </h3>

          </div>

        ) : trips.length === 0 ? (

          /* EMPTY */

          <div className="trip-empty">

            <CalendarDays size={48} />

            <h2>
              No trips yet
            </h2>

            <p>
              Create your first trip and
              start planning your adventure.
            </p>

            <button
              className="primary-button"
              onClick={() =>
                setShowCreateForm(true)
              }
            >
              <Plus size={18} />
              Create your first trip
            </button>

          </div>

        ) : (

          /* TRIPS */

          <div className="trip-grid">

            {trips.map((trip) => {

              const isFavorite =
                favoriteTrips.includes(
                  trip._id
                );

              return (

                <article
                  className="trip-card"
                  key={trip._id}
                >

                  {/* CARD TOP */}

                  <div className="trip-card-top">

                    <span className="trip-status">
                      {trip.status}
                    </span>

                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                      }}
                    >

                      {/* FAVORITE */}

                      <button
                        className="delete-trip"
                        onClick={() =>
                          toggleFavorite(
                            trip._id
                          )
                        }
                        title={
                          isFavorite
                            ? "Remove favorite"
                            : "Add to favorites"
                        }
                        style={{
                          color: isFavorite
                            ? "#f5b301"
                            : "inherit",
                        }}
                      >
                        <Star
                          size={18}
                          fill={
                            isFavorite
                              ? "currentColor"
                              : "none"
                          }
                        />
                      </button>

                      {/* DELETE */}

                      <button
                        className="delete-trip"
                        onClick={() =>
                          handleDeleteTrip(
                            trip._id
                          )
                        }
                        title="Delete trip"
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>

                  </div>

                  {/* NAME */}

                  <h3>
                    {trip.tripName}
                  </h3>

                  {/* DESTINATION */}

                  <div className="trip-detail">

                    <MapPin size={17} />

                    <span>
                      {trip.destination}
                    </span>

                  </div>

                  {/* DATES */}

                  <div className="trip-detail">

                    <CalendarDays
                      size={17}
                    />

                    <span>
                      {formatDate(
                        trip.startDate
                      )}{" "}
                      —{" "}
                      {formatDate(
                        trip.endDate
                      )}
                    </span>

                  </div>

                  {/* TRAVELERS */}

                  <div className="trip-detail">

                    <Users size={17} />

                    <span>

                      {trip.travelers}{" "}

                      {trip.travelers === 1
                        ? "traveler"
                        : "travelers"}

                    </span>

                  </div>

                  {/* DAYS */}

                  <div className="trip-detail">

                    <Clock size={17} />

                    <span>

                      {calculateDays(
                        trip.startDate,
                        trip.endDate
                      )}{" "}

                      days

                    </span>

                  </div>

                  {/* DESCRIPTION */}

                  {trip.description && (

                    <p className="trip-description">
                      {trip.description}
                    </p>

                  )}

                  {/* OPEN */}

                  <Link
                    to={`/trip/${trip._id}`}
                    className="primary-button trip-open-button"
                  >
                    Open Trip
                  </Link>

                </article>

              );
            })}

          </div>

        )}

      </section>

    </div>
  );
}

export default TripPlanner;
