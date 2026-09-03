import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Edit,
  MapPin,
  CalendarDays,
  Users,
  Clock,
  Save,
  X,
} from "lucide-react";
import { useAuth } from "./AuthContext.jsx";

function TripDetails() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "/api";

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // ADD DAY
  const [showDayForm, setShowDayForm] = useState(false);
  const [dayDate, setDayDate] = useState("");

  // ACTIVITY
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [selectedDayId, setSelectedDayId] = useState(null);
  const [editingActivity, setEditingActivity] = useState(null);

  const [activityForm, setActivityForm] = useState({
    name: "",
    location: "",
    time: "",
    description: "",
    category: "",
  });

  // EDIT TRIP
  const [showEditTripForm, setShowEditTripForm] = useState(false);

  const [editTripForm, setEditTripForm] = useState({
    tripName: "",
    destination: "",
    startDate: "",
    endDate: "",
    travelers: 1,
    description: "",
    status: "Planning",
  });

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // =========================
  // GET SINGLE TRIP
  // =========================

  const fetchTrip = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/trips/${id}`,
        authConfig
      );

      // Backend returns the trip directly
      setTrip(response.data);
    } catch (err) {
      console.error("Get trip error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load this trip."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTrip();
    } else {
      setLoading(false);
    }
  }, [id, token]);

  // =========================
  // EDIT TRIP
  // =========================

  const openEditTrip = () => {
    setEditTripForm({
      tripName: trip.tripName || "",
      destination: trip.destination || "",
      startDate: trip.startDate
        ? trip.startDate.split("T")[0]
        : "",
      endDate: trip.endDate
        ? trip.endDate.split("T")[0]
        : "",
      travelers: trip.travelers || 1,
      description: trip.description || "",
      status: trip.status || "Planning",
    });

    setShowEditTripForm(true);
    setError("");
    setMessage("");
  };

  const handleEditTripSubmit = async (e) => {
    e.preventDefault();

    if (
      !editTripForm.tripName ||
      !editTripForm.destination ||
      !editTripForm.startDate ||
      !editTripForm.endDate ||
      !editTripForm.travelers
    ) {
      setError("Please fill in all required trip details.");
      return;
    }

    if (
      new Date(editTripForm.endDate) <
      new Date(editTripForm.startDate)
    ) {
      setError("End date cannot be before start date.");
      return;
    }

    try {
      setError("");

      const response = await axios.put(
        `${API_URL}/trips/${id}`,
        {
          tripName: editTripForm.tripName,
          destination: editTripForm.destination,
          startDate: editTripForm.startDate,
          endDate: editTripForm.endDate,
          travelers: Number(editTripForm.travelers),
          description: editTripForm.description,
          status: editTripForm.status,
        },
        authConfig
      );

      setTrip(response.data.trip);

      setShowEditTripForm(false);

      setMessage("Trip updated successfully!");

      setEditTripForm({
        tripName: "",
        destination: "",
        startDate: "",
        endDate: "",
        travelers: 1,
        description: "",
        status: "Planning",
      });
    } catch (err) {
      console.error("Update trip error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to update trip."
      );
    }
  };

  // =========================
  // ADD DAY
  // =========================

  const handleAddDay = async (e) => {
    e.preventDefault();

    if (!dayDate) {
      setError("Please select a date.");
      return;
    }

    try {
      setError("");

      const response = await axios.post(
        `${API_URL}/trips/${id}/days`,
        {
          date: dayDate,
        },
        authConfig
      );

      setTrip(response.data.trip);

      setDayDate("");
      setShowDayForm(false);

      setMessage("Day added successfully!");
    } catch (err) {
      console.error("Add day error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to add day."
      );
    }
  };

  // =========================
  // OPEN ADD ACTIVITY
  // =========================

  const openActivityForm = (dayId) => {
    setSelectedDayId(dayId);

    setEditingActivity(null);

    setActivityForm({
      name: "",
      location: "",
      time: "",
      description: "",
      category: "",
    });

    setShowActivityForm(true);
    setError("");
    setMessage("");
  };

  // =========================
  // OPEN EDIT ACTIVITY
  // =========================

  const openEditActivity = (dayId, activity) => {
    setSelectedDayId(dayId);
    setEditingActivity(activity);

    setActivityForm({
      name: activity.name || "",
      location: activity.location || "",
      time: activity.time || "",
      description: activity.description || "",
      category: activity.category || "",
    });

    setShowActivityForm(true);
    setError("");
    setMessage("");
  };

  // =========================
  // ADD / UPDATE ACTIVITY
  // =========================

  const handleActivitySubmit = async (e) => {
    e.preventDefault();

    if (!activityForm.name) {
      setError("Activity name is required.");
      return;
    }

    try {
      setError("");

      let response;

      if (editingActivity) {
        response = await axios.put(
          `${API_URL}/trips/${id}/days/${selectedDayId}/activities/${editingActivity._id}`,
          activityForm,
          authConfig
        );

        setMessage("Activity updated successfully!");
      } else {
        response = await axios.post(
          `${API_URL}/trips/${id}/days/${selectedDayId}/activities`,
          activityForm,
          authConfig
        );

        setMessage("Activity added successfully!");
      }

      setTrip(response.data.trip);

      setShowActivityForm(false);
      setEditingActivity(null);
      setSelectedDayId(null);

      setActivityForm({
        name: "",
        location: "",
        time: "",
        description: "",
        category: "",
      });
    } catch (err) {
      console.error("Activity error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to save activity."
      );
    }
  };

  // =========================
  // DELETE ACTIVITY
  // =========================

  const handleDeleteActivity = async (
    dayId,
    activityId
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this activity?"
    );

    if (!confirmed) return;

    try {
      setError("");

      const response = await axios.delete(
        `${API_URL}/trips/${id}/days/${dayId}/activities/${activityId}`,
        authConfig
      );

      setTrip(response.data.trip);

      setMessage("Activity deleted successfully!");
    } catch (err) {
      console.error("Delete activity error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to delete activity."
      );
    }
  };

  // =========================
  // DELETE TRIP
  // =========================

  const handleDeleteTrip = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this trip?"
    );

    if (!confirmed) return;

    try {
      await axios.delete(
        `${API_URL}/trips/${id}`,
        authConfig
      );

      navigate("/trips");
    } catch (err) {
      console.error("Delete trip error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to delete trip."
      );
    }
  };

  // =========================
  // FORMAT DATE
  // =========================

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="trip-page">
        <div className="trip-message">
          <h2>Loading your trip...</h2>
        </div>
      </div>
    );
  }

  // =========================
  // TRIP NOT FOUND
  // =========================

  if (!trip) {
    return (
      <div className="trip-page">
        <div className="trip-message">
          <h2>Trip not found</h2>

          <Link
            to="/trips"
            className="primary-button"
          >
            Back to Trips
          </Link>
        </div>
      </div>
    );
  }

  // =========================
  // MAIN UI
  // =========================

  return (
    <div className="trip-page">

      {/* ================= HEADER ================= */}

      <div className="trip-header">

        <Link
          to="/trips"
          className="back-button"
        >
          <ArrowLeft size={18} />
          Back to Trips
        </Link>

        <div className="trip-title">
          <span className="eyebrow">
            YOUR JOURNEY
          </span>

          <h1>{trip.tripName}</h1>

          <p>{trip.destination}</p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
          }}
        >
          {/* EDIT TRIP */}

          <button
            className="secondary-button"
            onClick={openEditTrip}
            title="Edit trip"
          >
            <Edit size={18} />
            Edit Trip
          </button>

          {/* DELETE TRIP */}

          <button
            className="delete-trip"
            onClick={handleDeleteTrip}
            title="Delete trip"
          >
            <Trash2 size={20} />
          </button>
        </div>

      </div>

      {/* ================= MESSAGES ================= */}

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

      {/* ================= TRIP INFO ================= */}

      <section className="create-trip-card">

        <div className="trip-info-grid">

          <div className="trip-detail">
            <MapPin size={18} />

            <div>
              <strong>Destination</strong>
              <span>{trip.destination}</span>
            </div>
          </div>

          <div className="trip-detail">
            <CalendarDays size={18} />

            <div>
              <strong>Dates</strong>

              <span>
                {formatDate(trip.startDate)} —{" "}
                {formatDate(trip.endDate)}
              </span>
            </div>
          </div>

          <div className="trip-detail">
            <Users size={18} />

            <div>
              <strong>Travelers</strong>

              <span>{trip.travelers}</span>
            </div>
          </div>

          <div className="trip-detail">
            <Clock size={18} />

            <div>
              <strong>Status</strong>

              <span>{trip.status}</span>
            </div>
          </div>

        </div>

        {trip.description && (
          <p className="trip-description">
            {trip.description}
          </p>
        )}

      </section>

      {/* ================= ITINERARY ================= */}

      <section className="trips-section">

        <div className="section-heading">

          <div>
            <span className="eyebrow">
              ITINERARY
            </span>

            <h2>Your adventure plan</h2>
          </div>

          <button
            className="primary-button"
            onClick={() =>
              setShowDayForm(!showDayForm)
            }
          >
            <Plus size={18} />
            Add Day
          </button>

        </div>

        {/* ================= ADD DAY FORM ================= */}

        {showDayForm && (
          <section className="create-trip-card">

            <h2>Add a day</h2>

            <form onSubmit={handleAddDay}>

              <div className="form-group">

                <label>Date</label>

                <input
                  type="date"
                  value={dayDate}
                  onChange={(e) =>
                    setDayDate(e.target.value)
                  }
                />

              </div>

              <div className="form-actions">

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    setShowDayForm(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                >
                  <Plus size={18} />
                  Add Day
                </button>

              </div>

            </form>

          </section>
        )}

        {/* ================= NO ITINERARY ================= */}

        {trip.itinerary?.length === 0 ? (

          <div className="trip-empty">

            <CalendarDays size={48} />

            <h2>No itinerary yet</h2>

            <p>
              Add your first day to start planning
              your adventure.
            </p>

            <button
              className="primary-button"
              onClick={() =>
                setShowDayForm(true)
              }
            >
              <Plus size={18} />
              Add First Day
            </button>

          </div>

        ) : (

          /* ================= ITINERARY DAYS ================= */

          <div className="itinerary-list">

            {trip.itinerary.map((day) => (

              <article
                className="itinerary-day"
                key={day._id}
              >

                <div className="itinerary-day-header">

                  <div>

                    <span className="eyebrow">
                      DAY {day.day}
                    </span>

                    <h3>
                      {formatDate(day.date)}
                    </h3>

                  </div>

                  <button
                    className="primary-button"
                    onClick={() =>
                      openActivityForm(day._id)
                    }
                  >
                    <Plus size={16} />
                    Add Activity
                  </button>

                </div>

                {/* ================= NO ACTIVITIES ================= */}

                {day.activities?.length === 0 ? (

                  <div className="empty-activities">

                    <p>
                      No activities planned for this
                      day.
                    </p>

                  </div>

                ) : (

                  /* ================= ACTIVITIES ================= */

                  <div className="activity-list">

                    {day.activities.map(
                      (activity) => (

                        <div
                          className="activity-card"
                          key={activity._id}
                        >

                          <div className="activity-main">

                            <div className="activity-heading">

                              <h4>
                                {activity.name}
                              </h4>

                              {activity.category && (
                                <span className="trip-status">
                                  {activity.category}
                                </span>
                              )}

                            </div>

                            {activity.location && (
                              <div className="trip-detail">

                                <MapPin size={16} />

                                <span>
                                  {activity.location}
                                </span>

                              </div>
                            )}

                            {activity.time && (
                              <div className="trip-detail">

                                <Clock size={16} />

                                <span>
                                  {activity.time}
                                </span>

                              </div>
                            )}

                            {activity.description && (
                              <p className="trip-description">
                                {activity.description}
                              </p>
                            )}

                          </div>

                          <div className="activity-actions">

                            {/* EDIT ACTIVITY */}

                            <button
                              className="secondary-button"
                              onClick={() =>
                                openEditActivity(
                                  day._id,
                                  activity
                                )
                              }
                            >
                              <Edit size={16} />
                              Edit
                            </button>

                            {/* DELETE ACTIVITY */}

                            <button
                              className="delete-trip"
                              onClick={() =>
                                handleDeleteActivity(
                                  day._id,
                                  activity._id
                                )
                              }
                            >
                              <Trash2 size={16} />
                            </button>

                          </div>

                        </div>

                      )
                    )}

                  </div>
                )}

              </article>

            ))}

          </div>

        )}

      </section>

      {/* ================================================= */}
      {/* EDIT TRIP MODAL */}
      {/* ================================================= */}

      {showEditTripForm && (

        <div className="activity-modal">

          <div className="activity-modal-content">

            <div className="activity-modal-header">

              <div>

                <span className="eyebrow">
                  TRIP SETTINGS
                </span>

                <h2>Edit Trip</h2>

              </div>

              <button
                className="delete-trip"
                onClick={() =>
                  setShowEditTripForm(false)
                }
              >
                <X size={20} />
              </button>

            </div>

            <form
              onSubmit={handleEditTripSubmit}
            >

              <div className="form-grid">

                {/* TRIP NAME */}

                <div className="form-group">

                  <label>
                    Trip Name *
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. Dubai Adventure"
                    value={editTripForm.tripName}
                    onChange={(e) =>
                      setEditTripForm({
                        ...editTripForm,
                        tripName:
                          e.target.value,
                      })
                    }
                  />

                </div>

                {/* DESTINATION */}

                <div className="form-group">

                  <label>
                    Destination *
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. Dubai, UAE"
                    value={
                      editTripForm.destination
                    }
                    onChange={(e) =>
                      setEditTripForm({
                        ...editTripForm,
                        destination:
                          e.target.value,
                      })
                    }
                  />

                </div>

                {/* START DATE */}

                <div className="form-group">

                  <label>
                    Start Date *
                  </label>

                  <input
                    type="date"
                    value={
                      editTripForm.startDate
                    }
                    onChange={(e) =>
                      setEditTripForm({
                        ...editTripForm,
                        startDate:
                          e.target.value,
                      })
                    }
                  />

                </div>

                {/* END DATE */}

                <div className="form-group">

                  <label>
                    End Date *
                  </label>

                  <input
                    type="date"
                    value={
                      editTripForm.endDate
                    }
                    onChange={(e) =>
                      setEditTripForm({
                        ...editTripForm,
                        endDate:
                          e.target.value,
                      })
                    }
                  />

                </div>

                {/* TRAVELERS */}

                <div className="form-group">

                  <label>
                    Number of Travelers *
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={
                      editTripForm.travelers
                    }
                    onChange={(e) =>
                      setEditTripForm({
                        ...editTripForm,
                        travelers:
                          e.target.value,
                      })
                    }
                  />

                </div>

                {/* STATUS */}

                <div className="form-group">

                  <label>
                    Status
                  </label>

                  <select
                    value={
                      editTripForm.status
                    }
                    onChange={(e) =>
                      setEditTripForm({
                        ...editTripForm,
                        status:
                          e.target.value,
                      })
                    }
                  >
                    <option value="Planning">
                      Planning
                    </option>

                    <option value="Upcoming">
                      Upcoming
                    </option>

                    <option value="Completed">
                      Completed
                    </option>

                  </select>

                </div>

                {/* DESCRIPTION */}

                <div className="form-group full-width">

                  <label>
                    Description
                  </label>

                  <textarea
                    placeholder="Describe your trip..."
                    value={
                      editTripForm.description
                    }
                    onChange={(e) =>
                      setEditTripForm({
                        ...editTripForm,
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
                    setShowEditTripForm(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                >
                  <Save size={18} />
                  Save Changes
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* ================================================= */}
      {/* ACTIVITY MODAL */}
      {/* ================================================= */}

      {showActivityForm && (

        <div className="activity-modal">

          <div className="activity-modal-content">

            <div className="activity-modal-header">

              <div>

                <span className="eyebrow">
                  ITINERARY
                </span>

                <h2>
                  {editingActivity
                    ? "Edit Activity"
                    : "Add Activity"}
                </h2>

              </div>

              <button
                className="delete-trip"
                onClick={() =>
                  setShowActivityForm(false)
                }
              >
                <X size={20} />
              </button>

            </div>

            <form
              onSubmit={handleActivitySubmit}
            >

              <div className="form-grid">

                {/* ACTIVITY NAME */}

                <div className="form-group">

                  <label>
                    Activity Name *
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. Visit Eiffel Tower"
                    value={activityForm.name}
                    onChange={(e) =>
                      setActivityForm({
                        ...activityForm,
                        name: e.target.value,
                      })
                    }
                  />

                </div>

                {/* LOCATION */}

                <div className="form-group">

                  <label>
                    Location
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. Downtown Dubai"
                    value={
                      activityForm.location
                    }
                    onChange={(e) =>
                      setActivityForm({
                        ...activityForm,
                        location:
                          e.target.value,
                      })
                    }
                  />

                </div>

                {/* TIME */}

                <div className="form-group">

                  <label>
                    Time
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. 10:00 AM"
                    value={activityForm.time}
                    onChange={(e) =>
                      setActivityForm({
                        ...activityForm,
                        time: e.target.value,
                      })
                    }
                  />

                </div>

                {/* CATEGORY */}

                <div className="form-group">

                  <label>
                    Category
                  </label>

                  <select
                    value={
                      activityForm.category
                    }
                    onChange={(e) =>
                      setActivityForm({
                        ...activityForm,
                        category:
                          e.target.value,
                      })
                    }
                  >

                    <option value="">
                      Select category
                    </option>

                    <option value="Food">
                      Food
                    </option>

                    <option value="Adventure">
                      Adventure
                    </option>

                    <option value="Culture">
                      Culture
                    </option>

                    <option value="Shopping">
                      Shopping
                    </option>

                    <option value="Sightseeing">
                      Sightseeing
                    </option>

                    <option value="Relaxation">
                      Relaxation
                    </option>

                    <option value="Other">
                      Other
                    </option>

                  </select>

                </div>

                {/* DESCRIPTION */}

                <div className="form-group full-width">

                  <label>
                    Description
                  </label>

                  <textarea
                    placeholder="Describe this activity..."
                    value={
                      activityForm.description
                    }
                    onChange={(e) =>
                      setActivityForm({
                        ...activityForm,
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
                    setShowActivityForm(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                >
                  <Save size={18} />

                  {editingActivity
                    ? "Update Activity"
                    : "Add Activity"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default TripDetails;