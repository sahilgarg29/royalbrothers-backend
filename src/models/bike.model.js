const mongoose = require("mongoose");

const bikeSchema = new mongoose.Schema(
  {
    model: { type: String, required: true },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "location",
      required: true,
    },
    pricePerHour: { type: Number, required: true },
    bookedSlots: [
      {
        from: { type: Date, required: true },
        to: { type: Date, required: true },
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("bike", bikeSchema);
