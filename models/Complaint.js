const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        default: "Pending"
    },
    priority: {
        type: String,
        enum: ["High", "Medium", "Low", "Unknown"],
        default: "Unknown"
    },
    confidenceScore: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["PENDING", "SOLVED"],
        default: "PENDING"
    }
}, { timestamps: true });

module.exports = mongoose.model("Complaint", complaintSchema);
