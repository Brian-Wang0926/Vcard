const jwt = require("jsonwebtoken");
// const User = require("../models/user-model");

const googleCallback = (req, res) => {
  const { user } = req;
  const tokenObj = { _id: user.id, email: user.email };
  const token = jwt.sign(tokenObj, process.env.JWT_SECRET);

  res.redirect(
    `http://localhost:3000?token=JWT ${token}&name=${user.name}&email=${user.email}&image=${user.thumbnail}&id=${user.id}`
  );
};

module.exports = {
  googleCallback,
};
