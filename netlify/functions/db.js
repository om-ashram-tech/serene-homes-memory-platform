const mongoose = require("mongoose");

let isConnected = false; // prevent multiple connections in Netlify

const connectDB = async () => {
  if (isConnected) {
    console.log("🔄 Using existing MongoDB connection");
    return;
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("❌ MONGODB_URI is missing");
    throw new Error("MONGODB_URI missing");
  }

  try {
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = conn.connections[0].readyState === 1;

    console.log("🔥 MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw new Error("Database connection failed");
  }
};

module.exports = connectDB;
