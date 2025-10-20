const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    specialty: {
      type: String,
      required: true,
      enum: [
        "قلب وأوعية دموية",
        "طب أسنان",
        "طب أطفال",
        "طب عام",
        "أنف وأذن وحنجرة",
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
    },
    experienceYears: { type: Number, default: 0 },
    location: {
      province: String,
      city: String,
    },

    contact: {
      email: { type: String, required: true },
      phone: { type: String, required: true },
      socialLinks: {
        facebook: { type: String },
        instagram: { type: String },
        linkedin: { type: String },
        portfolio: { type: String },
      },
    },

    //   availableTimes: [{ type: String }],
    rating: { type: Number, min: 0, max: 5, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
