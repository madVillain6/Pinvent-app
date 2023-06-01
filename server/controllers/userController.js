const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

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

  // generate token

  const token = generateToken(user._id);

  // send HTTP-only cookie

  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400),
    sameSite: "none",
    secure: true,
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
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid User Data");
  }
});

//login user

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //validate request
  if (!email || !password) {
    res.status(400);
    throw new Error("please add email and password");
  }

  //user exsists
  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("User not found please sign up");
  }

  // password validation

  const passwordIsCorrect = await bcrypt.compare(password, user.password);

  const token = generateToken(user._id);

  // send HTTP-only cookie

  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400),
    sameSite: "none",
    secure: true,
  });

  if (user && passwordIsCorrect) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(200).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
    });
  } else {
    res.status(400);
    throw new Error("Invalid Email or password");
  }
});

module.exports = {
  registerUser,
  loginUser,
};
