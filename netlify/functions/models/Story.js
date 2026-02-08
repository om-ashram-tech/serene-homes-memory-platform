const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
  {
    residentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Resident",
    },
    title: String,
    content: { type: String, required: true },
    authorName: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Story", storySchema);
