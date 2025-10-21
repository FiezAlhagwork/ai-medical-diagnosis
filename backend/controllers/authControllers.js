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
        city: user.city,
        province: user.province,
        gender: user.gender,
        age: user.age,
        role:user.role,
        token,
      },
      error: false,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, error: true });
  }
};


const loginUser = async (req, res) => {
  try {

  } catch (error) {}
};

const getUserProfile = async (req, res) => {
  try {
    
  } catch (error) {}
};

module.exports = { registerUser, loginUser, getUserProfile };
