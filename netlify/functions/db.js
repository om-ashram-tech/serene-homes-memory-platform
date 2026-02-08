process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const mongoose = require("mongoose");


let isConnected = false; // To avoid creating multiple Mongo connections

const connectDB = async () => {
  if (isConnected) {
    console.log("🔄 Using existing MongoDB connection");
    return;
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("❌ MONGODB_URI is missing in .env");
    throw new Error("MONGODB_URI missing");
  }

  try {
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = conn.connections[0].readyState === 1;

    if (isConnected) {
      console.log("🔥 MongoDB connected successfully");
    } else {
      console.log("⚠️ MongoDB connection state:", conn.connections[0].readyState);
    }
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    throw new Error("Database connection failed");
  }
};

module.exports = connectDB;
