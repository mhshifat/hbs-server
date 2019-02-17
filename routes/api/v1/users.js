const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const User = require("../../../models/User");

router.post("/auth", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({
        errors: [{ title: "Data Missing!", detail: "All fields is required!" }]
      });
    const isUserExist = await User.findOne({ email });
    if (!isUserExist)
      return res.status(400).json({
        errors: [
          {
            title: "User Exist!",
            detail: "A user of this email doesn't exist!"
          }
        ]
      });
    if (!isUserExist.isPwdValid(password)) {
      return res.status(400).json({
        errors: [
          {
            title: "User Exist!",
            detail: "Password wrong!"
          }
        ]
      });
    }
    const token = jwt.sign(
      { username: isUserExist.username, userId: isUserExist.id },
      "MySecretToken",
      { expiresIn: "1h" }
    );
    res.json(token);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      errors: [{ title: "Auth Error!", detail: "Auth failed!" }]
    });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({
        errors: [{ title: "Data Missing!", detail: "All fields is required!" }]
      });
    const isUserExist = await User.findOne({ email });
    if (isUserExist)
      return res.status(400).json({
        errors: [
          {
            title: "User Exist!",
            detail: "A user of this email already exist!"
          }
        ]
      });
    const createdUser = await User.create({ username, email, password });
    if (createdUser) {
      res.status(200).json({
        Registration: true
      });
    }
  } catch (err) {
    res.status(400).json({
      errors: [{ title: "Registration Error!", detail: "Registration failed!" }]
    });
  }
});

module.exports = router;
