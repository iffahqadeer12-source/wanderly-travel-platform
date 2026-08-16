import { useEffect, useState } from "react";
import axios from "axios";
import {
  Search,
  MapPin,
  ArrowRight,
  Star,
  Menu,
  X,
  Plane,
  Compass,
  Heart,
} from "lucide-react";
import { Routes, Route, Link } from "react-router-dom";

import "./App.css";
import DestinationDetails from "./DestinationDetails.jsx";

function HomePage() {
  const [destinations, setDestinations] = useState([]);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get destinations from backend
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);

        const API_URL = import.meta.env.VITE_API_URL || "/api";

        console.log("=================================");
        console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
        console.log(
          "FINAL API URL:",
          `${API_URL}/destinations`
        );
        console.log("=================================");

        const response = await axios.get(
          `${API_URL}/destinations`
        );

        console.log("API RESPONSE:", response.data);
        console.log(
          "NUMBER OF DESTINATIONS:",
          Array.isArray(response.data)
            ? response.data.length
            : "Response is not an array"
        );

        setDestinations(
          Array.isArray(response.data)
            ? response.data
            : response.data.destinations || []
        );

        setError("");
      } catch (error) {
        console.error(
          "ERROR FETCHING DESTINATIONS:",
          error
        );

        console.error(
          "ERROR RESPONSE:",
          error.response
        );

        console.error(
          "ERROR MESSAGE:",
          error.message
        );

        setError(
          "Unable to load destinations. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  // Search destinations
  const filteredDestinations = destinations.filter(
    (destination) => {
      const text = `${destination.name} ${destination.country} ${destination.city} ${destination.category}`;

      return text
        .toLowerCase()
        .includes(search.toLowerCase());
    }
  );

  // Featured destinations
  const featuredDestinations = destinations.filter(
    (destination) => destination.featured
  );

  // Scroll to section
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });

    setMenuOpen(false);
  };

  return (
    <div className="app">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-container">
          <div
            className="logo"
            onClick={() =>
              scrollToSection("home")
            }
          >
            <Compass size={30} />
            <span>Wanderly</span>
          </div>

          <div
            className={`nav-links ${
              menuOpen ? "open" : ""
            }`}
          >
            <button
              onClick={() =>
                scrollToSection("home")
              }
            >
              Home
            </button>

            <button
              onClick={() =>
                scrollToSection("destinations")
              }
            >
              Destinations
            </button>

            <button
              onClick={() =>
                scrollToSection("categories")
              }
            >
              Categories
            </button>

            <button
              onClick={() =>
                scrollToSection("about")
              }
            >
              About
            </button>
          </div>

          <button
            className="menu-button"
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
          >
            {menuOpen ? (
              <X size={25} />
            ) : (
              <Menu size={25} />
            )}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section
        className="hero"
        id="home"
      >
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <div className="hero-badge">
            <Plane size={16} />
            Explore the world
          </div>

          <h1>
            Discover places
            <br />
            <span>
              worth remembering.
            </span>
          </h1>

          <p>
            Find your next adventure, explore
            breathtaking destinations, and create
            memories that last a lifetime.
          </p>

          <div className="search-box">
            <Search size={22} />

            <input
              type="text"
              placeholder="Search destinations, countries or categories..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            <button
              onClick={() =>
                scrollToSection("destinations")
              }
            >
              Explore
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* FEATURED DESTINATIONS */}
      <section className="section featured-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              HANDPICKED FOR YOU
            </span>

            <h2>
              Featured destinations
            </h2>
          </div>

          <button
            className="view-all"
            onClick={() =>
              scrollToSection("destinations")
            }
          >
            View all
            <ArrowRight size={18} />
          </button>
        </div>

        {loading ? (
          <div className="empty-state">
            <h3>
              Loading destinations...
            </h3>
          </div>
        ) : error ? (
          <div className="empty-state">
            <Search size={40} />
            <h3>{error}</h3>
          </div>
        ) : (
          <div className="destination-grid">
            {featuredDestinations.map(
              (destination) => (
                <DestinationCard
                  key={destination._id}
                  destination={destination}
                />
              )
            )}
          </div>
        )}
      </section>

      {/* CATEGORIES */}
      <section
        className="section categories-section"
        id="categories"
      >
        <div className="section-heading centered">
          <span className="eyebrow">
            FIND YOUR VIBE
          </span>

          <h2>
            Explore by category
          </h2>

          <p>
            Whatever kind of adventure you're
            looking for, we've got a place for you.
          </p>
        </div>

        <div className="category-grid">
          {[
            ["Mountains", "🏔️"],
            ["Beaches", "🏝️"],
            ["Adventure", "🧗"],
            ["Cultural", "🏛️"],
            ["Historical", "🏺"],
            [
              "Nature & Wildlife",
              "🦁",
            ],
          ].map(
            ([category, emoji]) => (
              <button
                className="category-card"
                key={category}
                onClick={() => {
                  setSearch(category);
                  scrollToSection(
                    "destinations"
                  );
                }}
              >
                <span>{emoji}</span>

                <strong>
                  {category}
                </strong>

                <ArrowRight size={18} />
              </button>
            )
          )}
        </div>
      </section>

      {/* ALL DESTINATIONS */}
      <section
        className="section destinations-section"
        id="destinations"
      >
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              EXPLORE
            </span>

            <h2>
              All destinations
            </h2>
          </div>

          <span className="destination-count">
            {filteredDestinations.length} places
          </span>
        </div>

        {loading ? (
          <div className="empty-state">
            <h3>
              Loading destinations...
            </h3>
          </div>
        ) : error ? (
          <div className="empty-state">
            <Search size={40} />
            <h3>{error}</h3>
          </div>
        ) : filteredDestinations.length ===
          0 ? (
          <div className="empty-state">
            <Search size={40} />

            <h3>
              No destinations found
            </h3>

            <p>
              Try searching for another
              place or category.
            </p>
          </div>
        ) : (
          <div className="destination-grid">
            {filteredDestinations.map(
              (destination) => (
                <DestinationCard
                  key={destination._id}
                  destination={destination}
                />
              )
            )}
          </div>
        )}
      </section>

      {/* ABOUT */}
      <section
        className="about-section"
        id="about"
      >
        <div className="about-content">
          <span className="eyebrow">
            ABOUT WANDERLY
          </span>

          <h2>
            Your world is
            <br />
            waiting to be explored.
          </h2>

          <p>
            Wanderly helps travelers discover
            beautiful places around the world.
            From peaceful mountain escapes to
            vibrant cultural cities, your next
            adventure starts here.
          </p>

          <button
            className="primary-button"
            onClick={() =>
              scrollToSection(
                "destinations"
              )
            }
          >
            Start exploring
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-logo">
          <Compass size={24} />
          <strong>
            Wanderly
          </strong>
        </div>

        <p>
          Made for explorers who believe
          the journey matters.
        </p>

        <div className="footer-heart">
          <Heart size={16} />
          Travel more. Live more.
        </div>
      </footer>
    </div>
  );
}

// DESTINATION CARD
function DestinationCard({
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

        {destination.featured && (
          <span className="featured-badge">
            <Star
              size={14}
              fill="currentColor"
            />
            Featured
          </span>
        )}
      </div>

      <div className="card-content">
        <div className="location">
          <MapPin size={15} />
          {destination.city},{" "}
          {destination.country}
        </div>

        <h3>
          {destination.name}
        </h3>

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

// MAIN APP ROUTES
function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<HomePage />}
      />

      <Route
        path="/destination/:id"
        element={
          <DestinationDetails />
        }
      />
    </Routes>
  );
}

export default App;
