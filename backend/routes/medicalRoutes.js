const express = require("express");
const { createDiagnosis } = require("../controllers/medicalController.js");
const { protect } = require("../Middleware/authMiddleware.js");
const router = express.Router();

router.post("/", protect, createDiagnosis);

module.exports = router;
