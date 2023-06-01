const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const protect = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(401);
      throw new Error("Not authorised Please Log in");
    }

    // verify token

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // get user id from token
    const user = await User.findById(verified.id).select("-password");

    if (!user) {
      res.status(401);
      throw new Error("User not found");
    }
    req.user = user;
  } catch (error) {
    res.status(401);
    throw new Error("Not authorised Please Log in");
  }
});

module.exports = protect;
