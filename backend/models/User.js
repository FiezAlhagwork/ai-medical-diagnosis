const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
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
    location: {
      province: { type: String },
      city: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
