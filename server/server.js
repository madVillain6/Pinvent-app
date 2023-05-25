const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoute = require("./routes/userRoute");

const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

//route middleware
app.use("/api/users", userRoute);

//Routes
app.get("/", (req, res) => {
  res.send("home page");
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server runing on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
