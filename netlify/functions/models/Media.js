const mongoose = require("mongoose");

const MediaSchema = new mongoose.Schema({
  residentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resident",
    required: true
  },

  // MUST MATCH FRONTEND: "photo" or "video"
  type: {
    type: String,
    enum: ["photo", "video"],
    required: true
  },

  url: {
    type: String,
    required: true
  },

  // ✅ REQUIRED for deleting from Cloudinary
  publicId: {
    type: String,
    required: true
  },

  title: String,
  description: String,

  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Media", MediaSchema);
