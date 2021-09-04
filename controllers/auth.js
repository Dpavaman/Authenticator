exports.register = (req, res, next) => {
  res.send("Reguster route");
};

exports.login = (req, res, next) => {
  res.send("Login route");
};

exports.forgotPassword = (req, res, next) => {
  res.send("Forgot password route");
};

exports.resetPassword = (req, res, next) => {
  res.send("Reset password route");
};
