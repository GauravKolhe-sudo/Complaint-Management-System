const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const connectDB = require("./config/db");
require("dotenv").config();

const seedManager = async () => {
    try {
        await connectDB();

        const email = "manager@cms.com";
        const password = "managerpassword";

        const existingManager = await User.findOne({ email });
        if (existingManager) {
            console.log("Manager already exists");
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const manager = new User({
            email,
            password: hashedPassword,
            role: "manager"
        });

        await manager.save();
        console.log("Manager account created successfully!");
        console.log("Email: " + email);
        console.log("Password: " + password);
        process.exit(0);
    } catch (error) {
        console.error("Error seeding manager:", error);
        process.exit(1);
    }
};

seedManager();
