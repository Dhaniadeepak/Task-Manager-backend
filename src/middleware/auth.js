const jwt = require("jsonwebtoken");
const env = require("../config/env");
const User = require("../models/User");
const { ApiError } = require("./errorHandler");

// Protects routes: requires "Authorization: Bearer <token>"
const protect = async (req, res, next) => {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new ApiError(401, "Authentication required");
  }

  const payload = jwt.verify(token, env.jwtSecret);
  const user = await User.findById(payload.id);
  if (!user) {
    throw new ApiError(401, "User no longer exists");
  }

  req.user = user;
  next();
};

module.exports = protect;
