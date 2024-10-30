const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

// @desc : Register a new user
// @route : POST /api/users
// @access : Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ message: "Please fill in all fields" });
  }

  //Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({ message: "User already exists" });
  }

  //Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = new User({
    name,
    email,
    password: hashedPassword
  });


  await user.save();

  res.status(201).json({ message: "User created successfully", user: user, token: generateToken(user._id) });
});

// @desc : Login a user
// @route : POST /api/users/login
// @access : Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
    if (!email || !password) {
        res.status(400).json({ message: "Please fill in all fields" });
    }

    const user = await User.findOne({email});

    if(!user){
        res.status(400).json({message: "Invalid credentials"});
    } else {
        const isMatch = await bcrypt.compare(password, user.password);
        if(isMatch){
            let token = generateToken(user._id);
            res.json({message: "Login successful", token: token});
        } else {
            res.status(400).json({message: "Invalid credentials"});
        }
    }
});

// @desc : Get user profile
// @route : GET /api/users/me
// @access : Private
const getUserProfile = asyncHandler(async (req, res) => {
  const { _id, name, email } = await User.findById(req.user._id);

  res.status(200).json({ _id, name, email });
});

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" })
}

module.exports = { registerUser, loginUser, getUserProfile };
