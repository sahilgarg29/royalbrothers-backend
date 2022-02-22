const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "location",
      required: true,
    },
    bike: { type: mongoose.Schema.Types.ObjectId, ref: "bike", required: true },
    amount: { type: Number, required: true },
    pickupTime: { type: Date, required: true },
    dropoffTime: { type: Date, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("booking", BookingSchema);
