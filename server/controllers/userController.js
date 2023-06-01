const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("please fill all required fields");
  }
  if (password.length < 6) {
    throw new Error("password must be up to 6 characters");
  }

  const userExsists = await User.findOne({ email });
  if (userExsists) {
    res.status(400);
    throw new Error("email has already been used");
  }

  // create new user
  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(201).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
    });
  } else {
    res.status(400);
    throw new Error("Invalid User Data");
  }
});

module.exports = {
  registerUser,
};
