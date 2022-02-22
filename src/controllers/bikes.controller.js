const express = require("express");
const Bikes = require("../models/bike.model");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const bikes = await Bikes.find({}).populate("locations").lean().exec();

    return res.status(200).send({ bikes });
  } catch (err) {
    res
      .status(500)
      .send({ status: "fail", message: err.message, err: { err } });
  }
});

module.exports = router;
