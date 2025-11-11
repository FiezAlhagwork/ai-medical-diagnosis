const express = require("express");
const { createDiagnosis, getAllDiagnoses, getDiagnosisById , deleteDiagnosis } = require("../controllers/medicalController.js");
const { protect } = require("../Middleware/authMiddleware.js");
const router = express.Router();

router.post("/", protect, createDiagnosis);
router.get("/", protect ,getAllDiagnoses )
router.get("/:id", protect, getDiagnosisById);
router.delete("/:id" , protect , deleteDiagnosis)

module.exports = router;
