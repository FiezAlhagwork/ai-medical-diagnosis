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
    matchedSpecialty: {
      type: String,
      enum: [
        "القلب والاوعية الدموية",
        "طب أسنان",
        "طب أطفال",
        "طب عام",
        "أنف وأذن وحنجرة",
        "امراض الجهاز التنفسي",
        "طوارئ",
        "أمراض الدم والأورام",
        "جراحة الكلى والمسالك البولية",
        "أمراض معدية",
        "جراحة عامة",
        "تغذية",
        "غدد صماء",
        "باطنية",
        "جراحة العظام والمفاصل",
        "معالج نفسي",
        "كلى",
        "دماغ وأعصاب",
        "روماتيزم ومفاصل",
        "جلدية وتناسلية",
        "صدرية",
        "جراحة دماغ وأعصاب وعمود فقري",
        "جراحة الأوعية الدموية",
        "سمع ونطق",
      ],
      required: true,
    },

    confidence: { type: String },
    severity: { type: String },
    next_step: { type: String },
    advice: { type: String, required: true },
    possible_condition: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MedicalRecord", medicalRecord);
