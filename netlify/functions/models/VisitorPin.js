const mongoose = require("mongoose");

const visitorPinSchema = new mongoose.Schema({
  pin: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("VisitorPin", visitorPinSchema);
