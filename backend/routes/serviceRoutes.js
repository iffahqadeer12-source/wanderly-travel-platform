const express = require("express");

const {
  getServices,
  getService,
  addService,
  updateService,
  deleteService,
} = require("../controllers/serviceController");

const router = express.Router();

// GET ALL SERVICES
router.get("/", getServices);

// GET SINGLE SERVICE
router.get("/:id", getService);

// ADD SERVICE
router.post("/", addService);

// UPDATE SERVICE
router.put("/:id", updateService);

// DELETE SERVICE
router.delete("/:id", deleteService);

module.exports = router;
