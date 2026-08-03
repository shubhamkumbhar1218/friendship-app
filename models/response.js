const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "Anonymous"
    },
    answer: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Response", responseSchema);