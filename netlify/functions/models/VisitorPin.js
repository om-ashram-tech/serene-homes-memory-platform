// netlify/functions/models/VisitorPin.js
const mongoose = require("mongoose");

const VisitorPinSchema = new mongoose.Schema({
  pinHash: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("VisitorPin", VisitorPinSchema);
