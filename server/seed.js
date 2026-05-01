require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const seedManager = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const existing = await User.findOne({ email: "manager@company.com" });
        if (existing) {
            console.log("Manager already exists. Skipping seed.");
            process.exit(0);
        }

        const passwordHash = await bcrypt.hash("Manager@1234", 10);

        await User.create({
            email: "manager@company.com",
            passwordHash,
            role: "manager"
        });

        console.log("✅ Manager seeded successfully!");
        console.log("   Email    : manager@company.com");
        console.log("   Password : Manager@1234");
        process.exit(0);
    } catch (error) {
        console.error("Seed failed:", error.message);
        process.exit(1);
    }
};

seedManager();
