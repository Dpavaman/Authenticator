const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

exports.register = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.create({
      username,
      email,
      password,
    });

    sendToken(user, 201, res);
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

    sendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorResponse("Email could not be sent", 404));
    }
    const resetToken = user.getResetPasswordToken();
    await user.save();
    const resetUrl = `http://localhost:3000/resetPassword/${resetToken}`;
    const message = `
    <h1>You have requested a password Request</h1>
    <p>Please click on the <a href=${resetUrl} clicktracking=off >here</a> link to reset your password</p>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        text: message,
      });
      res.status(200).json({
        success: true,
        data: "Email Sent",
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordTokenExpiry = undefined;
      await user.save();
      return next(new ErrorResponse("Email could not be sent", 500));
    }
  } catch (error) {
    return next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");
  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordTokenExpiry: { $gt: Date.now() },
    });
    if (!user) {
      return next(new ErrorResponse("Invalid reset Token", 400));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiry = undefined;
    user.save();
    res.status(200).json({
      success: true,
      data: "Password reset successful",
    });
  } catch (error) {
    next(error);
  }
};

const sendToken = (user, statusCode, res) => {
  const token = user.getSignedToken();
  res.status(statusCode).json({ success: true, token });
};
