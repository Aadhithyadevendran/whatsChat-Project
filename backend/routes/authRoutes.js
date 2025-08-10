const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

router.post("/signup", async (req, res) => {
  const { name, email } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "User already exists" });

    const newUser = new User({ name, email });
    await newUser.save();
    res.json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ error: "Signup error" });
  }
});

router.post("/firebase-register", async (req, res) => {
  const { email, name, password } = req.body;

  try {
    let user = await User.findOne({ email });
    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;

    if (!user) {
      user = new User({ email, name, hashedPassword });
    } else {
      user.name = name;
      user.password = hashedPassword;
    }

    await user.save();
    res.status(200).json({ message: "User registered/updated successfully" });
  } catch (err) {
    console.error("Firebase Register Error:", err);
    res.status(500).json({ error: "Firebase registration error" });
  }
});
router.get("/debug-passwords", async (req, res) => {
  try {
    const users = await User.find({}, { email: 1, password: 1, _id: 0 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});
router.post("/set-password", async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "Password set successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error setting password" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !user.password)
      return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    res.json({ success: true, message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ error: "Login error" });
  }
});

module.exports = router;
