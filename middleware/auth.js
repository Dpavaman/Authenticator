//This file handles protected routes.

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.replace("Bearer ", "");
  }

  if (!token) {
    return next(
      new ErrorResponse("You are not authorized to access this route", 401)
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = User.findById(decoded.id);
    if (!user) {
      return next(new ErrorResponse("Invalid access token", 404));
    }
    req.user = user;
    next();
  } catch (error) {
    return next(new ErrorResponse("Something went wrong", 401));
  }
};
