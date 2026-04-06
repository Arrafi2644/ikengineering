import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DB_URL = process.env.DB_URL || "mongodb://127.0.0.1:27017";

export const connectDB = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1); // Exit if DB connection fails
  }
};