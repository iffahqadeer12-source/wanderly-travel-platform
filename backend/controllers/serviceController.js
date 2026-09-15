const Service = require("../models/Service");

// GET ALL SERVICES
const getServices = async (req, res) => {
  try {
    const { category } = req.query;

    const filter = {};

    if (category) {
      filter.category = category;
    }

    const services = await Service.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json({
      services,
    });
  } catch (error) {
    console.error("Get services error:", error);

    res.status(500).json({
      message: "Server error while getting services",
    });
  }
};

// GET SINGLE SERVICE
const getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    res.status(200).json(service);
  } catch (error) {
    console.error("Get service error:", error);

    res.status(500).json({
      message: "Server error while getting service",
    });
  }
};

// ADD SERVICE
const addService = async (req, res) => {
  try {
    const {
      name,
      category,
      location,
      description,
      image,
      price,
      rating,
      availability,
      features,
    } = req.body;

    if (
      !name ||
      !category ||
      !location ||
      !description ||
      !image ||
      price === undefined
    ) {
      return res.status(400).json({
        message: "Please provide all required service details",
      });
    }

    const service = await Service.create({
      name,
      category,
      location,
      description,
      image,
      price,
      rating: rating || 0,
      availability:
        availability !== undefined ? availability : true,
      features: features || [],
    });

    res.status(201).json({
      message: "Service added successfully",
      service,
    });
  } catch (error) {
    console.error("Add service error:", error);

    res.status(500).json({
      message: "Server error while adding service",
    });
  }
};

// UPDATE SERVICE
const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    const {
      name,
      category,
      location,
      description,
      image,
      price,
      rating,
      availability,
      features,
    } = req.body;

    if (name !== undefined) service.name = name;
    if (category !== undefined) service.category = category;
    if (location !== undefined) service.location = location;
    if (description !== undefined)
      service.description = description;
    if (image !== undefined) service.image = image;
    if (price !== undefined) service.price = price;
    if (rating !== undefined) service.rating = rating;
    if (availability !== undefined)
      service.availability = availability;
    if (features !== undefined) service.features = features;

    const updatedService = await service.save();

    res.status(200).json({
      message: "Service updated successfully",
      service: updatedService,
    });
  } catch (error) {
    console.error("Update service error:", error);

    res.status(500).json({
      message: "Server error while updating service",
    });
  }
};

// DELETE SERVICE
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    await service.deleteOne();

    res.status(200).json({
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.error("Delete service error:", error);

    res.status(500).json({
      message: "Server error while deleting service",
    });
  }
};

module.exports = {
  getServices,
  getService,
  addService,
  updateService,
  deleteService,
};
