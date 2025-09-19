const bcrypt = require("bcrypt");
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

module.exports = { registerUser };
