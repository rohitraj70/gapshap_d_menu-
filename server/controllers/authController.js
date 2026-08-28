import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// @desc    Register the first admin user (used once via seed or setup)
// @route   POST /api/auth/register
// @access  Public (should be disabled/protected after first admin is created)
export const registerAdmin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    throw new Error("Please provide username and password");
  }

  const existingAdmin = await User.findOne({ username });
  if (existingAdmin) {
    res.status(400);
    throw new Error("Admin with this username already exists");
  }

  const user = await User.create({ username, password });

  res.status(201).json({
    success: true,
    data: {
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    },
  });
});

// @desc    Admin login
// @route   POST /api/auth/login
// @access  Public
export const loginAdmin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    throw new Error("Please provide username and password");
  }

  const user = await User.findOne({ username }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid username or password");
  }

  res.json({
    success: true,
    data: {
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    },
  });
});

// @desc    Get logged in admin profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user });
});
