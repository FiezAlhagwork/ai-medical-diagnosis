const express = require("express");
const {
  createLocation,
  getAllLocation,
  getCitiesByProvince,
  getProvinces,
  updateLocation,
} = require("../controllers/locationController");
const { adminOnly, protect } = require("../Middleware/authMiddleware");

const router = express.Router();

router.get("/", getAllLocation);
router.get("/provinces", getProvinces);
router.get("/cities", getCitiesByProvince);
router.post("/", protect, adminOnly, createLocation);
router.put("/:province", updateLocation); // تعديل محافظة موجودة

module.exports = router;
