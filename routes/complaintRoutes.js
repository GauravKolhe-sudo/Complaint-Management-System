const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");
const jwt = require("jsonwebtoken");

// Middleware to verify token
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Access denied" });

    try {
        const verified = jwt.verify(token, "SECRET_KEY");
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: "Invalid token" });
    }
};

// Classification logic (calling Python Server)
const classifyComplaint = async (description) => {
    try {
        const response = await fetch("http://localhost:8000/classify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ description })
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Python Server error:", error);
        return { priority: "Unknown", confidence_score: 0 };
    }
};


// Submit complaint
router.post("/submit", authenticate, async (req, res) => {
    try {
        const { subject, description } = req.body;
        if (!subject || !description) {
            return res.status(400).json({ message: "Subject and description are required" });
        }

        const classification = await classifyComplaint(description);

        const newComplaint = new Complaint({
            userId: req.user.userId,
            subject,
            description,
            priority: classification.priority,
            confidenceScore: classification.confidence_score,
            status: "PENDING"
        });

        await newComplaint.save();
        res.status(201).json({ message: "Complaint submitted successfully", complaint: newComplaint });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Get all complaints (for manager)
router.get("/all", authenticate, async (req, res) => {
    try {
        if (req.user.role !== "manager") {
            return res.status(403).json({ message: "Access denied" });
        }
        const complaints = await Complaint.find().populate("userId", "email");
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Get user's complaints
router.get("/user", authenticate, async (req, res) => {
    try {
        const complaints = await Complaint.find({ userId: req.user.userId });
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Update status
router.patch("/status/:id", authenticate, async (req, res) => {
    try {
        if (req.user.role !== "manager") {
            return res.status(403).json({ message: "Access denied" });
        }
        const { status } = req.body;
        const complaint = await Complaint.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json(complaint);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
