const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cities",
      required: true,
    },
    address: { type: String, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("location", locationSchema);
