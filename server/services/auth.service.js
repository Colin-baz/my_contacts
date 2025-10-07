const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const registerUser = async (email, password) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error("User already exists");
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    email,
    password: hashedPassword,
  });

  await user.save();
  return user;
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("Utilisateur non trouvé");
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error("Mot de passe incorrect");
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h"
  });

  return { token, user };
};


const getUsers = async () => {
  return await User.find().select("-password"); 
};

module.exports = { registerUser, loginUser, getUsers };
