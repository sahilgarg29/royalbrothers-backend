const mongoose = require("mongoose");

const bikeSchema = new mongoose.Schema(
  {
    model: { type: String, required: true, unique: true },
    imageUrl: { type: String, required: true, unique: true },
    locations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "location",
        required: true,
      },
    ],
    pricePerHour: { type: Number, required: true },
    bookedSlots: [
      {
        location: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "location",
          required: true,
        },
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
