require("dotenv").config();
const express = require("express");
const port = process.env.PORT || 5000;
const cors = require("cors");
const connectDb = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const locationRoutes = require("./routes/locationRoutes");

const app = express();

//Middleware to handle CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

//Connect DataBase
connectDb();

// Middleware
app.use(express.json());

// Route
app.use("/api/auth", authRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/location", locationRoutes);

app.get("/", (req, res) => {
  res.send("AI Medical Diagnosis Backend is running");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
