import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User-model.js";
import dotenv from "dotenv";
dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const adminExists = await User.findOne({ email: "admin@estateflow.com" });
    if (adminExists) {
      console.log("Admin already exists!");
      process.exit();
    }
    const hashedPassword = await bcrypt.hash("admin12345", 10);
    const admin = new User({
      name: "Admin",
      email: "admin@estateflow.com",
      password: hashedPassword,
      role: "admin",
      phoneNumber: "8107681593",
    });
    await admin.save();
    console.log("✅ Admin user created: admin@estateflow.com / admin12345");
    process.exit();
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};
seedAdmin();
