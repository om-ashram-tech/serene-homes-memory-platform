// /netlify/functions/models/Resident.js
const mongoose = require("mongoose");

const ResidentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    age: Number,

    gender: { type: String, default: "" },

    short_bio: { type: String, default: "" },

    room_number: { type: String, default: "" },

    profile_photo_url: { type: String, default: "" },

    extra_photos: [{ type: String }],

    public_token: { type: String, unique: true },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Resident || mongoose.model("Resident", ResidentSchema);
