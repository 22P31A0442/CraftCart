// ✅ server.js (Fully Updated & Working with Debug Logs)
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

console.log("✅ Server code loaded");

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ✅ Debug Request Logger
app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.url}`);
    next();
});

// ✅ Create uploads directory if not exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// ✅ Multer config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});
const upload = multer({ storage });

// ✅ Connect to MongoDB
mongoose.connect("mongodb+srv://pullepunageswari:TFJQykuNI9TPUYdL@cluster0.fb04twr.mongodb.net/myshop?retryWrites=true&w=majority")
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ User Schema
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    mobile: String,
    password: String,
    address: String,
    pincode: String,
    profilePic: String
});
const User = mongoose.model("User", userSchema);
// ✅ Wishlist Schema
const wishlistSchema = new mongoose.Schema({
    userEmail: String,
    productId: String,
    title: String,
    price: Number,
    image: String
});
const Wishlist = mongoose.model("Wishlist", wishlistSchema);


// ✅ Email & OTP
const EMAIL_SENDER = "pullepunageswari@gmail.com";
const EMAIL_PASSWORD = "xemf jkza ycsj dvce";
const otpStore = {};

// ✅ Check if email already exists
app.post("/check-email", async(req, res) => {
    const { email } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        res.json({ exists: !!existingUser });
    } catch (err) {
        console.error("Check email error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// ✅ Send OTP
app.post("/send-otp", async(req, res) => {
    const { name, contact } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: EMAIL_SENDER,
                pass: EMAIL_PASSWORD
            }
        });

        await transporter.sendMail({
            from: `MyShop <${EMAIL_SENDER}>`,
            to: contact,
            subject: "OTP for MyShop Signup",
            text: `Hello ${name},\n\nYour OTP is: ${otp}\n\nRegards,\nMyShop Team`
        });

        otpStore[contact] = otp;
        res.json({ success: true });
    } catch (err) {
        console.error("OTP Error:", err.message);
        res.status(500).json({ success: false, message: "Failed to send OTP" });
    }
});

// ✅ Verify OTP
app.post("/verify-otp", (req, res) => {
    const { contact, otp } = req.body;
    if (otpStore[contact] && otpStore[contact].toString() === otp.toString()) {
        delete otpStore[contact];
        res.json({ success: true });
    } else {
        res.json({ success: false, message: "Invalid OTP" });
    }
});

// ✅ Register User
app.post("/register", async(req, res) => {
    const { name, email, mobile, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "❌ Email already exists. Try login or use another email."
            });
        }

        const newUser = new User({ name, email, mobile, password });
        await newUser.save();

        res.status(201).json({
            success: true,
            message: "✅ User registered successfully!"
        });
    } catch (err) {
        console.error("Register error:", err);
        res.status(500).json({
            success: false,
            message: "❌ Server error during registration."
        });
    }
});

// ✅ Login
app.post("/login", async(req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.json({ success: false, message: "User not found" });

        if (password !== user.password)
            return res.json({ success: false, message: "Invalid password" });

        res.json({ success: true, email: user.email });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// ✅ Get Full Profile
app.get("/get-user", async(req, res) => {
    const { email } = req.query;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        res.json({
            success: true,
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            address: user.address || "",
            pincode: user.pincode || "",
            profilePic: user.profilePic || ""
        });
    } catch (err) {
        console.error("Get user error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// ✅ Update Profile with file upload
app.post("/update-profile", upload.single("profileImage"), async(req, res) => {
    const { email, address, pincode } = req.body;
    let profilePic = req.file ? `/uploads/${req.file.filename}` : undefined;

    try {
        const updateData = { address, pincode };
        if (profilePic) updateData.profilePic = profilePic;

        const updatedUser = await User.findOneAndUpdate({ email },
            updateData, { new: true }
        );

        if (!updatedUser) return res.json({ success: false, message: "User not found" });

        res.json({ success: true, profilePic: updatedUser.profilePic });
    } catch (err) {
        console.error("Update profile error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// ✅ Dummy session
app.get("/logged-in-email", (req, res) => {
    res.json({ success: true, email: "pullepunageswari@gmail.com" });
});

// ✅ Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Start Server
app.listen(3000, () => {
    console.log("🚀 Server running on http://localhost:3000");
});