const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
  path: path.join(__dirname, ".env"),
});

console.log(
  "JWT SECRET EXISTS:",
  !!process.env.JWT_SECRET
);

const connectDB = require("./config/db");

const destinationRoutes = require("./routes/destinationRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const tripRoutes = require("./routes/tripRoutes");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/destinations", destinationRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/trips", tripRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to Wanderly API");
});

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}
