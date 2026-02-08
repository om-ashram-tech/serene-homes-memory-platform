const mongoose = require("mongoose");

const TempAccessTokenSchema = new mongoose.Schema({
  residentToken: { type: String, required: true },
  tempToken: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true }
});

module.exports = mongoose.model("TempAccessToken", TempAccessTokenSchema);
