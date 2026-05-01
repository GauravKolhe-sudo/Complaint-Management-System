const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// POST /api/auth/signup  — always creates a "user" role
router.post("/signup", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters." });
        }

        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(400).json({ message: "Email already registered." });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            email: email.toLowerCase(),
            passwordHash,
            role: "user"
        });

        await user.save();

        res.status(201).json({ message: "Account created successfully. Please login." });
    } catch (error) {
        console.error("Signup error:", error.message);
        res.status(500).json({ message: "Server error during signup." });
    }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "8h" }
        );

        res.json({
            message: "Login successful.",
            token,
            role: user.role,
            email: user.email
        });
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({ message: "Server error during login." });
    }
});

module.exports = router;
