require("dotenv").config();
const express = require("express");
const Bookings = require("../models/booking.model");
const Bikes = require("../models/bike.model");
const Razorpay = require("razorpay");
const authenticate = require("../middlewares/authenticate");
const router = express.Router();
const crypto = require("crypto");

router.get("/", authenticate, async (req, res) => {
  try {
    const bookings = await Bookings.find({
      user: req.user._id,
      status: "success",
    })
      .populate("bike")
      .populate("location")
      .lean()
      .exec();
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
      if (
        bookedSlots[i].location.toString() == req.body.locationId.toString()
      ) {
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

    let diffInMill = dt - pt;

    let hours = Math.round(Math.abs(diffInMill) / 36e5);

    var instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET_KEY,
    });

    var options = {
      amount:
        (hours * bike.pricePerHour + 500 + hours * bike.pricePerHour * 0.24) *
        100, // amount in the smallest currency unit
      currency: "INR",
    };
    instance.orders.create(options, async function (err, order) {
      if (err) return res.status(500).send(err);

      const booking = await Bookings.create({
        user: req.user._id,
        location: req.body.locationId,
        bike: req.body.bikeId,
        amount: hours * bike.pricePerHour,
        pickupTime: pt,
        dropoffTime: dt,
        orderId: order.id,
      });

      return res.status(201).send({ booking });
    });
  } catch (err) {
    return res
      .status(500)
      .send({ status: "fail", message: err.message, err: { err } });
  }
});

router.post("/verify", authenticate, async (req, res) => {
  try {
    let body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;

    var expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(body.toString())
      .digest("hex");
    console.log("sig received ", req.body.razorpay_signature);
    console.log("sig generated ", expectedSignature);

    if (expectedSignature === req.body.razorpay_signature) {
      const booking = await Bookings.findOneAndUpdate(
        { orderId: req.body.razorpay_order_id },
        { status: "success" }
      );

      const updatedBike = await Bikes.findByIdAndUpdate(booking.bike, {
        $push: {
          bookedSlots: {
            location: booking.location,
            pickupTime: booking.pickupTime,
            dropoffTime: booking.dropoffTime,
          },
        },
      });
      return res.status(200).send({ booking });
    } else {
      return res.status(400).send({ message: "Invalid Payment Signature" });
    }
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

module.exports = router;
