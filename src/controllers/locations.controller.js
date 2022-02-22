const express = require("express");
const Locations = require("../models/location.model");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const locations = await Locations.find({}).populate("city").lean().exec();

    return res.status(200).send({ locations });
  } catch (err) {
    res
      .status(500)
      .send({ status: "fail", message: err.message, err: { err } });
  }
});

router.post("/", async (req, res) => {
  try {
    const location = await Locations.create(req.body);

    return res.status(201).send(location);
  } catch (err) {
    res
      .status(500)
      .send({ status: "fail", message: err.message, err: { err } });
  }
});

module.exports = router;
