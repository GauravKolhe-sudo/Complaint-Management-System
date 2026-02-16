const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
    userEmail: { type: String, required: true },   // Link complaint to logged-in user
    title: { type: String, required: true },       // Complaint title
    category: { type: String, required: true },    // Complaint category
    text: { type: String, required: true },        // Complaint text
    priority: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" }, // Priority
    status: { type: String, enum: ["Pending", "Completed"], default: "Pending" },   // Status
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Complaint", complaintSchema);
