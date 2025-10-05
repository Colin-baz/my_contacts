const asyncHandler = require("express-async-handler");
const { registerUser, loginUser, getUsers } = require("../services/auth.service");

const register = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await registerUser(email, password);

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
  const { token, user } = await loginUser(email, password);

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

const users = asyncHandler(async (res) => {
  const users = await getUsers();
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
