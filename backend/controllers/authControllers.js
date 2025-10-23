const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {
  loginValidation,
  registerValidation,
} = require("../validation/userValidation");

const generateToken = (userid) => {
  return jwt.sign({ id: userid }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

//@desc Register a new User
//@route POST /api/auth/register
//@access Public
const registerUser = async (req, res) => {
  try {
    const { error } = registerValidation(req.body);
    if (error)
      return res
        .status(400)
        .json({ message: error.details[0].message, error: true });

    const { name, email, password, city, province, gender, age } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists", error: true });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create new user

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      city,
      province,
      gender,
      age,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      message: "The account has been created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
      error: false,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, error: true });
  }
};

//@desc Login a user
//@route POST /api/auth/login
//@access Public
const loginUser = async (req, res) => {
  try {
    const { error } = loginValidation(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found", error: true });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "The password is incorrect", error: true });
    }

    const token = generateToken(user._id);

    res.json({
      message: "You have successfully logged in.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
      error: false,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, error: true });
  }
};

//@desc get user info by Id
//@route GET /api/auth/users  
//@access Public

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    if (
      req.user.role !== "admin" &&
      req.user._id.toString() !== req.params.id
    ) {
      return res.status(403).json({
        message: "You are not authorized to see this data.",
        true: true,
      });
    }

    res.status(200).json({
      message: "User profile updated successfully.",
      user,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, error: true });
  }
};

module.exports = { registerUser, loginUser, getUserProfile };
