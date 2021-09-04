const Mongoose = require("mongoose");

const userSchema = new Mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a valid username"],
  },
  email: {
    type: String,
    required: [true, "Please provide a valid email"],
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@]+(\.[^<>()[\]\\.,;:\s@]+)*)|(".+"))@((\[[0-9]{1-3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-z\-0-9]+\.)+[a-zA-z]{2,}))$/,
      "Please provide a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please provide a valid password"],
    select: false,
    minlength: 6,
  },
  resetPasswordToken: String,
  resetPasswordTokenExpiry: Date,
});

const User = Mongoose.model("User", userSchema);

module.exports = User;
