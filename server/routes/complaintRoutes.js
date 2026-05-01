const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");
const { authenticate, authorizeManager } = require("../middleware/authMiddleware");

// Call Python classifier
const classifyComplaint = async (description) => {
    try {
        const response = await fetch("http://localhost:8000/classify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ description })
        });
        if (!response.ok) throw new Error("Classifier responded with error");
        const result = await response.json();
        return {
            category: result.category || "Uncategorized",
            priority: result.priority || "Unknown",
            confidenceScore: result.confidence_score || 0
        };
    } catch (error) {
        console.error("Classifier error:", error.message);
        return { category: "Uncategorized", priority: "Unknown", confidenceScore: 0 };
    }
};

// POST /api/complaints/submit — user files a complaint
router.post("/submit", authenticate, async (req, res) => {
    try {
        const { subject, description, contactNumber, location } = req.body;

        if (!subject || !description) {
            return res.status(400).json({ message: "Subject and description are required." });
        }

        const { category, priority, confidenceScore } = await classifyComplaint(description);

        const complaint = new Complaint({
            email: req.user.email,
            subject,
            description,
            contactNumber: contactNumber || "",
            location: location || "",
            category,
            priority,
            confidenceScore,
            status: "PENDING"
        });

        await complaint.save();

        res.status(201).json({ message: "Complaint submitted successfully.", complaint });
    } catch (error) {
        console.error("Submit complaint error:", error.message);
        res.status(500).json({ message: "Server error while submitting complaint." });
    }
});

// GET /api/complaints/my — get logged-in user's complaints
router.get("/my", authenticate, async (req, res) => {
    try {
        const complaints = await Complaint.find({ email: req.user.email }).sort({ createdAt: -1 });
        res.json(complaints);
    } catch (error) {
        console.error("Fetch user complaints error:", error.message);
        res.status(500).json({ message: "Server error while fetching complaints." });
    }
});

// GET /api/complaints/:id — get single complaint by id (user must own it or be manager)
router.get("/:id", authenticate, async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found." });
        }
        if (req.user.role !== "manager" && complaint.email !== req.user.email) {
            return res.status(403).json({ message: "Access denied." });
        }
        res.json(complaint);
    } catch (error) {
        console.error("Fetch complaint error:", error.message);
        res.status(500).json({ message: "Server error while fetching complaint." });
    }
});

// GET /api/complaints/all/list — manager gets all complaints
router.get("/all/list", authenticate, authorizeManager, async (req, res) => {
    try {
        const complaints = await Complaint.find().sort({ createdAt: -1 });
        res.json(complaints);
    } catch (error) {
        console.error("Fetch all complaints error:", error.message);
        res.status(500).json({ message: "Server error while fetching complaints." });
    }
});

// PATCH /api/complaints/:id/status — manager updates complaint status
router.patch("/:id/status", authenticate, authorizeManager, async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ["PENDING", "IN_PROGRESS", "SOLVED"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value." });
        }

        const complaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found." });
        }

        res.json({ message: "Status updated.", complaint });
    } catch (error) {
        console.error("Update status error:", error.message);
        res.status(500).json({ message: "Server error while updating status." });
    }
});

module.exports = router;
