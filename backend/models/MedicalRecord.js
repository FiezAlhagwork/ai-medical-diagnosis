const mongoose = require("mongoose");

const medicalRecord = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    symptomsText: { type: String, required: true },
    quickSymptoms: [{ type: String }], // قائمة بالأعراض السريعة المختارة (اختيارية)
    duration: {
      type: String, // مثل "يوم واحد" - "أسبوعين" - "شهر"
      enum: [
        "أقل من يوم",
        "1-3 أيام",
        "أسبوع",
        "أسبوعين",
        "شهر",
        "أكثر من شهر",
      ],
    },
    aiPrompt: { type: String },
    aiResponse: { type: mongoose.Schema.Types.Mixed },
    matchedSpecialty: { type: String },
    matchedDoctors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Doctor" }],
    confidence: { type: Number },
    severity: { type: String, enum: ["بسيط", "متوسط", "عالي", "طارئ"] },
    next_step: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MedicalRecord", medicalRecord);
