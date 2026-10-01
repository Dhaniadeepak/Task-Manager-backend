const jwt = require("jsonwebtoken");
const env = require("../config/env");
const User = require("../models/User");
const { ApiError } = require("../middleware/errorHandler");

const signToken = (userId) =>
  jwt.sign({ id: userId }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

const sendAuthResponse = (res, statusCode, user) => {
  res.status(statusCode).json({ user, token: signToken(user.id) });
};

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(409, "Email already registered");
  }

  const user = await User.create({ name, email, password });
  sendAuthResponse(res, 201, user);
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  sendAuthResponse(res, 200, user);
};

module.exports = { signup, login };
