const Location = require("../models/ProvinceCity");
const locationSchema = require("../validation/locationValidation");

//@desc get all province and city1
//@route GET /api/locations
//@access privet
const getAllLocation = async (req, res) => {
  try {
    const locations = await Location.find({}).sort({ province: 1 });
    res.status(200).json({
      message: "The locations were successfully returned",
      count: locations.length,
      locations,
      error: false,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, error: true });
  }
};
//@desc get all province
//@route GET /api/locations/provinces
//@access public
const getProvinces = async (req, res) => {
  try {
    const provinces = await Location.find({}, "province").sort({ province: 1 });
    return res.json({
      message: "The provinces were successfully returned",
      provinces: provinces.map((p) => p.province),
      error: false,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, error: true });
  }
};

//@desc get all Province
//@route GET /api/locations/cities?province
//@access public
const getCitiesByProvince = async (req, res) => {
  try {
    const { province } = req.query;
    if (!province) {
      return res.status(400).json({
        message: "The name of the governorate must be specified.",
        error: true,
      });
    }

    const location = await Location.findOne({ province });
    if (!location) {
      return res
        .status(404)
        .json({ message: "This province was not found.", error: true });
    }

    res
      .status(200)
      .json({
        message: "All cities have been brought",
        cities: location.cities,
        error: false,
      });
  } catch (error) {
    res.status(500).json({ message: error.message, error: true });
  }
};

//@desc Create  (province and city) (Admin)
//@route POST /api/locations
//@access Privet
const createLocation = async (req, res) => {
  try {
    const { error, value } = locationSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        message: "Data verification failed",
        details: error.details.map((e) => e.message),
        error: true,
      });
    }

    const { province, cities } = value;

    const existing = await Location.findOne({ province });
    if (existing) {
      return res.status(400).json({
        message: "The province already exists,",
        error: true,
      });
    }

    const newLocation = await Location.create({ province, cities });
    res.status(201).json({
      message: "The new governorate was created",
      location: newLocation,
    });
  } catch (err) {
    res.status(500).json({ message: err.message, error: true });
  }
};

//@desc Update  (province and city) (Admin)
//@route Put /api/locations
//@access Privet
const updateLocation = async (req, res) => {
  try {
    const { error, value } = locationSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: "Data verification failed",
        details: error.details.map((e) => e.message),
        error: true,
      });
    }

    const { cities } = value;
    const { province } = req.params;

    const location = await Location.findOne({ province });
    if (!location) {
      return res.status(404).json({
        message: "province Not Found",
        error: true,
      });
    }

    location.cities = cities;

    await location.save();
    res.status(200).json({
      message: "Cities have been successfully updated ",
      location,
    });
  } catch (err) {
    res.status(500).json({ message: err.message, error: true });
  }
};

module.exports = {
  getAllLocation,
  getProvinces,
  getCitiesByProvince,
  createLocation,
  updateLocation,
};
