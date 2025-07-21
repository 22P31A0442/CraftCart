
const express = require('express');
const router = express.Router();
const User = require('../models/User');


router.post('/signup', async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'User already exists' });

    const newUser = new User({ fullName, email, password });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (err) {
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.status(200).json({ message: 'Login successful', user: { fullName: user.fullName, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

module.exports = router;
