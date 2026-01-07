const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    gender: { type: String, enum: ["ذكر", "أنثى"], required: true },
    age: { type: Number, required: true },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    }, // Role-based access
    province: {
      type: String,
      required: true,
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
    city: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
