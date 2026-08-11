const express = require("express");

const {
  getDestinations,
  getDestination,
  addDestination,
  updateDestination,
  deleteDestination,
} = require("../controllers/destinationController");

const router = express.Router();

// GET all destinations
router.get("/", getDestinations);

// GET one destination
router.get("/:id", getDestination);

// ADD destination
router.post("/", addDestination);

// UPDATE destination
router.put("/:id", updateDestination);

// DELETE destination
router.delete("/:id", deleteDestination);

module.exports = router;