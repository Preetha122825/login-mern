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
  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },
});

const User = mongoose.model("User", userSchema);


// Home Route
app.get("/", (req, res) => {
  res.send("Backend Connected Successfully");
});


// Login API
app.post("/login", async (req, res) => {

  try {

    console.log("Login Data:", req.body);

    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if(user){

      res.json({
        success: true,
        message: "Login Successful"
      });

    } else {

      res.json({
        success: false,
        message: "Invalid Email or Password"
      });

    }

  } catch(err){

    console.log("Login Error:", err);

    res.status(500).json({
      success: false,
      message: "Login Failed",
      error: err.message
    });
  }
});

// Register API
app.post("/register", async (req, res) => {

  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password required"
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.json({
        success: false,
        message: "User already exists"
      });
    }

    const user = new User({
      email,
      password
    });

    await user.save();

    res.json({
      success: true,
      message: "User Registered"
    });

  } catch (err) {

    console.log("Register Error:", err);

    res.status(500).json({
      success: false,
      message: "Registration Failed"
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});