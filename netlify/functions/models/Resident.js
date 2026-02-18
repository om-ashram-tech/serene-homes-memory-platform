// /netlify/functions/models/Resident.js
const mongoose = require("mongoose");

const ResidentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    age: { type: Number, default: null },

    gender: { type: String, default: "" },

    short_bio: { type: String, default: "" },

    // ✅ NEW FIELD — Catchy Phrase
    catchy_phrase: { type: String, default: "" },

    room_number: { type: String, default: "" },

    // ✅ NEW FIELD — Year of Admission
    year_of_admission: { type: Number, default: null },

    profile_photo_url: { type: String, default: "" },

    extra_photos: [{ type: String }],

    public_token: { type: String, unique: true },
  },
  { timestamps: true }
);



module.exports = mongoose.model("Resident", ResidentSchema);

