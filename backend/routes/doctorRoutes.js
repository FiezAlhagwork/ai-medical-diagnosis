const express = require("express");
const router = express.Router();
const { adminOnly, protect } = require("../Middleware/authMiddleware");
const {
  getAllDoctors,
  getDoctorById,
  searchDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  searchDoctorAfterAi,
  getTopRatedDoctors
} = require("../controllers/doctorController");
const upload = require("../Middleware/uploadImage");


router.get("/", protect, adminOnly, getAllDoctors);
router.get("/search", searchDoctors);
router.get("/top-rated", getTopRatedDoctors);
router.get("/:id", getDoctorById);
router.get("/search-doctors/:id", protect, searchDoctorAfterAi);
router.post("/", protect, adminOnly, upload.single("image"), createDoctor);
router.put("/:id", protect, adminOnly, upload.single("image"), updateDoctor);
router.delete("/:id", protect, adminOnly, deleteDoctor);

module.exports = router;
