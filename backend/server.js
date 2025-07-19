const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const User = require('./models/User');
const productRoute = require('./routes/productRoute'); 


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/products/', productRoute);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("✅ MongoDB connected successfully");
}).catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});


app.post('/api/users/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error creating user" });
  }
});

// Login
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
});
app.get('/api/users/profile/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile" });
  }
});






const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));





