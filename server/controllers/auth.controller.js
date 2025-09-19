const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userModel = require("../models/User");
const asyncHandler = require("express-async-handler");

const register = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    return res.status(403).json({ message: "Email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new userModel({
    email,
    password: hashedPassword, 
  });

  await user.save();

  return res.status(201).json({
    message: "User created successfully",
    user: {
      id: user._id,
      email: user.email,
      createdAt: user.createdAt,
    },
    success: true,
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Authentication failed" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Authentication failed" });
  }

  const token = jwt.sign(
    {
      email: user.email,
      userId: user._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return res.status(200).json({
    message: "Login successful",
    accessToken: token,
    user: {
      id: user._id,
      email: user.email,
    },
    success: true,
  });
});

const users = asyncHandler(async (req, res) => {
  const users = await userModel.find().select("-password"); 
  return res.status(200).json({
    data: users,
    success: true,
    message: "Users list",
  });
});

module.exports = {
  register,
  login,
  users,
};
