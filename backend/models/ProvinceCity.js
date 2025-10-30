const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    province: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      enum: [
        "دمشق",
        "ريف دمشق",
        "حلب",
        "حمص",
        "حماة",
        "اللاذقية",
        "طرطوس",
        "إدلب",
        "درعا",
        "السويداء",
        "دير الزور",
        "الرقة",
        "الحسكة",
        "القنيطرة",
      ],
    },
    cities: [{ type: String, required: true, trim: true }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Location", locationSchema);
