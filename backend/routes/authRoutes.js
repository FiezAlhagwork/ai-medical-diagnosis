const express = require("express")
const { registerUser, loginUser, getUserProfile } = require("../controllers/authControllers")
const router = express.Router()
const {protect} = require("../Middleware/authMiddleware")


router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users/:id", protect, getUserProfile);

module.exports = router