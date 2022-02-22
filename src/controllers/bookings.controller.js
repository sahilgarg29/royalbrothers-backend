const express = require("express");
const Bookings = require("../models/booking.model");
const Bikes = require("../models/bike.model");

const authenticate = require("../middlewares/authenticate");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const bookings = await Bookings.find({}).lean().exec();
    bookings.forEach((booking) => {
      console.log(booking.pickupTime.getDate());
    });
    return res.status(200).send({ bookings });
  } catch (err) {
    return res
      .status(500)
      .send({ status: "fail", message: err.message, err: { err } });
  }
});

router.post("/", authenticate, async (req, res) => {
  try {
    const bike = await Bikes.findById(req.body.bikeId).lean().exec();

    let bookedSlots = bike.bookedSlots;
    let pt = new Date(req.body.pickupTime);
    let dt = new Date(req.body.dropoffTime);
    flag = true;
    for (let i = 0; i < bookedSlots.length; i++) {
      if (bookedSlots[i].location == req.body.locationId) {
        if (
          (bookedSlots[i].pickupTime > pt && bookedSlots[i].pickupTime > dt) ||
          (bookedSlots[i].dropoffTime < pt && bookedSlots[i].dropoffTime < dt)
        ) {
          continue;
        } else {
          flag = false;
        }
      }
    }

    if (!flag) {
      return res.status(400).send({ message: "Not available" });
    }

    const updatedBike = await Bikes.findByIdAndUpdate(req.body.bikeId, {
      $push: {
        bookedSlots: {
          location: req.body.locationId,
          pickupTime: pt,
          dropoffTime: dt,
        },
      },
    });

    const booking = await Bookings.create({
      user: req.user._id,
      location: req.body.locationId,
      bike: req.body.bikeId,
      amount: req.body.amount,
      pickupTime: new Date("2022-02-22T20:00:00Z"),
      dropoffTime: new Date("2022-02-23T20:00:00Z"),
    });

    return res.status(201).send({ booking });
  } catch (err) {
    return res
      .status(500)
      .send({ status: "fail", message: err.message, err: { err } });
  }
});

module.exports = router;
