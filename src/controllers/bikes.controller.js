const express = require("express");
const Bikes = require("../models/bike.model");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let bikes = await Bikes.find({})
      .populate({
        path: "locations",
        populate: {
          path: "city",
        },
      })
      .lean()
      .exec();

    if (req.query.city) {
      bikes = bikes.filter((bike) => {
        bike.locations = bike.locations.filter((location) => {
          return location.city.name == req.query.city;
        });

        return bike.locations.length > 0;
      });
    }

    // if(req.query.city){
    //   query = query.
    // }

    return res.status(200).send({ bikes });
  } catch (err) {
    res
      .status(500)
      .send({ status: "fail", message: err.message, err: { err } });
  }
});

router.post("/", async (req, res) => {
  try {
    const bike = await Bikes.create(req.body);

    return res.status(201).send(bike);
  } catch (err) {
    res
      .status(500)
      .send({ status: "fail", message: err.message, err: { err } });
  }
});

module.exports = router;
