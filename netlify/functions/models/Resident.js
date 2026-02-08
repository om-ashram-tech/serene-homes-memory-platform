// /netlify/functions/models/Resident.js
const mongoose = require("mongoose");

const ResidentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,

  gender: { type: String, default: "" },

  // Short biography from form
  short_bio: { type: String, default: "" },

  // Room number from form
  room_number: { type: String, default: "" },

  // Profile photo URL stored by form
  profile_photo_url: { type: String, default: "" },

  // Permanent QR token
  public_token: { type: String, unique: true },

  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Resident", ResidentSchema);
