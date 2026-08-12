const express = require("express");

const {
  getDestinations,
  getDestination,
  addDestination,
  updateDestination,
  deleteDestination,
} = require("../controllers/destinationController");

const router = express.Router();

router.get("/", getDestinations);
router.get("/:id", getDestination);
router.post("/", addDestination);
router.put("/:id", updateDestination);
router.delete("/:id", deleteDestination);

module.exports = router;
