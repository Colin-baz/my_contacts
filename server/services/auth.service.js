const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const registerUser = async (email, password) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
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

  return { token, user };
};

const getUsers = async () => {
  return await User.find().select("-password"); 
};

module.exports = { registerUser, loginUser, getUsers };
