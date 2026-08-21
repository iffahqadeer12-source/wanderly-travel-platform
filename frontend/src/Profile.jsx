import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  User,
  Heart,
  Clock,
  MapPin,
  ArrowRight,
  Edit,
  Save,
} from "lucide-react";
import { useAuth } from "./AuthContext.jsx";

function Profile() {
  const { token } = useAuth();

  const [profile, setProfile] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);

const [name, setName] = useState("");
const [bio, setBio] = useState("");
const [profileImage, setProfileImage] = useState("");

const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!token) {
        setError("Please login first.");
        setLoading(false);
        return;
      }

      try {
        const API_URL =
          import.meta.env.VITE_API_URL || "/api";

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // Get profile
        const profileResponse = await axios.get(
          `${API_URL}/users/profile`,
          config
        );

        // Get favorites
        const favoritesResponse = await axios.get(
          `${API_URL}/users/favorites`,
          config
        );

        // Get recently viewed
        const recentlyViewedResponse =
          await axios.get(
            `${API_URL}/users/recently-viewed`,
            config
          );

        setProfile(profileResponse.data);
        setName(profileResponse.data.name || "");
setBio(profileResponse.data.bio || "");
setProfileImage(
  profileResponse.data.profileImage || ""
);

        setFavorites(
          favoritesResponse.data.favorites || []
        );

        setRecentlyViewed(
          recentlyViewedResponse.data.recentlyViewed ||
            []
        );

        setError("");
      } catch (error) {
        console.error(
          "Profile error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Unable to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [token]);

  if (loading) {
    return (
      <div className="details-message">
        <h2>Loading profile...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="details-message">
        <h2>{error}</h2>

        <Link
          to="/"
          className="back-button"
        >
          <ArrowLeft size={18} />
          Back to Wanderly
        </Link>
      </div>
    );
  }
const handleUpdateProfile = async (e) => {
  e.preventDefault();

  if (!token) {
    alert("Please login first.");
    return;
  }

  try {
    setSaving(true);

    const API_URL =
      import.meta.env.VITE_API_URL || "/api";

    const response = await axios.put(
      `${API_URL}/users/profile`,
      {
        name,
        bio,
        profileImage,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(
      "Profile updated:",
      response.data
    );

    setProfile(response.data.user);
    setEditing(false);

    alert("Profile updated successfully!");
  } catch (error) {
    console.error(
      "Profile update error:",
      error
    );

    alert(
      error.response?.data?.message ||
        "Unable to update profile."
    );
  } finally {
    setSaving(false);
  }
};
  return (
    <div className="profile-page">
      <Link
        to="/"
        className="back-button"
      >
        <ArrowLeft size={18} />
        Back to Wanderly
      </Link>

      {/* PROFILE HEADER */}
      <div className="profile-card">
        <div className="profile-avatar">
          {profile?.profileImage ? (
            <img
              src={profile.profileImage}
              alt={profile.name}
            />
          ) : (
            <User size={40} />
          )}
        </div>

        <h1>{profile?.name}</h1>

        <p className="profile-email">
          {profile?.email}
        </p>

        <p className="profile-bio">
          {profile?.bio ||
            "No bio added yet."}
        </p>
<button
  className="edit-profile-button"
  onClick={() => setEditing(!editing)}
>
  <Edit size={18} />

  {editing
    ? "Cancel"
    : "Edit Profile"}
</button>
{editing && (
  <form
    className="edit-profile-form"
    onSubmit={handleUpdateProfile}
  >
    <h2>Edit Profile</h2>

    <label>Name</label>

    <input
      type="text"
      value={name}
      onChange={(e) =>
        setName(e.target.value)
      }
      required
    />

    <label>Bio</label>

    <textarea
      value={bio}
      onChange={(e) =>
        setBio(e.target.value)
      }
      placeholder="Tell us something about yourself..."
      rows="4"
    />

    <label>Profile Image URL</label>

    <input
      type="text"
      value={profileImage}
      onChange={(e) =>
        setProfileImage(e.target.value)
      }
      placeholder="https://..."
    />

    <button
      type="submit"
      className="primary-button"
      disabled={saving}
    >
      <Save size={18} />

      {saving
        ? "Saving..."
        : "Save Changes"}
    </button>
  </form>
)}
        <div className="profile-stats">
          <div>
            <Heart size={22} />

            <strong>
              {favorites.length}
            </strong>

            <span>Favorites</span>
          </div>

          <div>
            <Clock size={22} />

            <strong>
              {recentlyViewed.length}
            </strong>

            <span>Recently Viewed</span>
          </div>
        </div>
      </div>

      {/* FAVORITES */}
      <section className="profile-section">
        <div className="profile-section-heading">
          <div>
            <span className="eyebrow">
              SAVED FOR LATER
            </span>

            <h2>
              Your Favorites ❤️
            </h2>
          </div>
        </div>

        {favorites.length === 0 ? (
          <div className="empty-state">
            <Heart size={40} />

            <h3>
              No favorites yet
            </h3>

            <p>
              Click the heart on a destination
              to save it here.
            </p>
          </div>
        ) : (
          <div className="destination-grid">
            {favorites.map(
              (destination) => (
                <ProfileDestinationCard
                  key={destination._id}
                  destination={destination}
                />
              )
            )}
          </div>
        )}
      </section>

      {/* RECENTLY VIEWED */}
      <section className="profile-section">
        <div className="profile-section-heading">
          <div>
            <span className="eyebrow">
              YOUR JOURNEY
            </span>

            <h2>
              Recently Viewed 🕒
            </h2>
          </div>
        </div>

        {recentlyViewed.length === 0 ? (
          <div className="empty-state">
            <Clock size={40} />

            <h3>
              Nothing viewed yet
            </h3>

            <p>
              Destinations you visit will
              appear here.
            </p>
          </div>
        ) : (
          <div className="destination-grid">
            {recentlyViewed.map(
              (destination) => (
                <ProfileDestinationCard
                  key={destination._id}
                  destination={destination}
                />
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function ProfileDestinationCard({
  destination,
}) {
  return (
    <article className="destination-card">
      <div className="card-image">
        <img
          src={destination.imageUrl}
          alt={destination.name}
        />

        <span className="category-badge">
          {destination.category}
        </span>
      </div>

      <div className="card-content">
        <div className="location">
          <MapPin size={15} />

          {destination.city},{" "}
          {destination.country}
        </div>

        <h3>{destination.name}</h3>

        <p>
          {destination.description}
        </p>

        <Link
          to={`/destination/${destination._id}`}
          className="card-button"
        >
          Explore destination
          <ArrowRight size={17} />
        </Link>
      </div>
    </article>
  );
}

export default Profile;
