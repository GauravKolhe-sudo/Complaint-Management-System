const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true
        },
        subject: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        contactNumber: {
            type: String,
            default: ""
        },
        location: {
            type: String,
            default: ""
        },
        category: {
            type: String,
            default: "Uncategorized"
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
            enum: ["PENDING", "IN_PROGRESS", "SOLVED"],
            default: "PENDING"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);
