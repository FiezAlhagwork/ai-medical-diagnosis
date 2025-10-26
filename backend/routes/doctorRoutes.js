const express = require("express");
const router = express.Router();
const { adminOnly, protect } = require("../Middleware/authMiddleware");
const {
  getAllDoctors,
  searchDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} = require("../controllers/doctorController");


router.get("/", protect, adminOnly, getAllDoctors);
router.get("/search", searchDoctors);
router.post("/", protect, adminOnly, createDoctor);
router.put("/:id", protect, adminOnly, updateDoctor);
router.delete("/:id", protect, adminOnly, deleteDoctor);

module.exports = router;
