const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("../../backend/config/db");
const destinationRoutes = require("../../backend/routes/destinationRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Wanderly API" });
});

app.use("/", destinationRoutes);

module.exports.handler = serverless(app);
