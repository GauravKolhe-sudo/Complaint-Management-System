const mongoose = require("mongoose");
const Complaint = require("./server/models/Complaints");

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/userDB");
        console.log("MongoDB connected for verification.");

        const count = await Complaint.countDocuments();
        console.log(`Total Complaints in DB: ${count}`);

        if (count > 0) {
            const complaints = await Complaint.find();
            console.log("Complaints data:", JSON.stringify(complaints, null, 2));
        } else {
            console.log("No complaints found in the database.");
        }

        process.exit(0);
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

connectDB();
