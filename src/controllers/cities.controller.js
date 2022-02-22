const express = require("express");
const Cities = require("../models/city.model");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const cities = await Cities.find({}).lean().exec();

    return res.status(200).send({ cities });
  } catch (err) {
    res
      .status(500)
      .send({ status: "fail", message: err.message, err: { err } });
  }
});

module.exports = router;
