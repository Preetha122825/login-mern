const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "https://login-mern-eta.vercel.app",
    methods: ["GET", "POST"],
  })
);

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));


// User Schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);


// Home Route
app.get("/", (req, res) => {
  res.send("Backend Connected Successfully");
});


// Login API
app.post("/login", async (req, res) => {

  const { email, password } = req.body;

  try {

    const user = await User.findOne({ email, password });

    if (user) {
      res.json({
        success: true,
        message: "Login Successful",
      });
    } else {
      res.json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

  } catch (err) {
    res.status(500).json(err);
  }
});


// Register API
app.post("/register", async (req, res) => {

  try {

    const user = new User(req.body);

    await user.save();

    res.json({
      success: true,
      message: "User Registered",
    });

  } catch (err) {
    res.status(500).json(err);
  }
});

app.listen(5000, () => {
  console.log("Server Running on Port 5000");
});