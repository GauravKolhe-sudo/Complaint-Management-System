// routes/complaint.js
const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaints");

// Add complaint
router.post("/add", async (req, res) => {
    const { userEmail, title, category, text } = req.body;

    if (!userEmail || !title || !category || !text) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const newComplaint = new Complaint({
            userEmail,
            title,
            category,
            text,
        });

        await newComplaint.save();
        res.status(201).json({ message: "Complaint added successfully", complaint: newComplaint });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Get complaints by user
router.get("/user", async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ message: "User email is required" });
    }

    try {
        const complaints = await Complaint.find({ userEmail: email }).sort({ createdAt: -1 });
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;
