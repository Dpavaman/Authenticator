const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

exports.register = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.create({
      username,
      email,
      password,
    });

    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new ErrorResponse("Please provide both email and password", 400)
    );
  }

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorResponse("Invalid Credentials", 401));
    }

    const areValidCredentials = await user.matchPassword(password);

    if (!areValidCredentials) {
      return next(new ErrorResponse("Invalid Credentials", 401));
    }

    res.status(201).json({ success: true, accessToken: "dummyToken" });
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = (req, res, next) => {
  res.send("Forgot password route");
};

exports.resetPassword = (req, res, next) => {
  res.send("Reset password route");
};
