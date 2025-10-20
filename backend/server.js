require("dotenv").config()
const express = require('express');
const port = process.env.PORT || 3000;
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());


app.get("/" ,(req, res) => {
    res.send("AI Medical Diagnosis Backend is running");
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


