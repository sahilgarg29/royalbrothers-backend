const express = require("express");
const Bikes = require("../models/bike.model");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    console.log(req.query);
    let bikes = await Bikes.find({})
      .populate({
        path: "locations",
        populate: {
          path: "city",
        },
      })
      .lean()
      .exec();

    let diffInMill =
      new Date(req.query.dropofftime) - new Date(req.query.pickuptime);

    let hours = Math.round(Math.abs(diffInMill) / 36e5);

    bikes.forEach((bike) => {
      bike.amount = hours * bike.pricePerHour;
    });

    if (req.query.sortbyprice) {
      if (req.query.sortbyprice == "asc") {
        bikes.sort(function (a, b) {
          return a.amount - b.amount;
        });
      } else if (req.query.sortbyprice == "desc") {
        bikes.sort(function (a, b) {
          return b.amount - a.amount;
        });
      }
    }

    if (req.query.models) {
      let modelsArr = req.query.models.split(",");

      bikes = bikes.filter((bike) => {
        if (modelsArr.includes(bike.model)) {
          return true;
        }

        return false;
      });
    }

    if (req.query.locations) {
      let locationsArr = req.query.locations.split(",");
      bikes = bikes.filter((bike) => {
        for (let i = 0; i < bike.locations.length; i++) {
          if (locationsArr.includes(bike.locations[i].name)) {
            return true;
          }
        }

        return false;
      });
    }

    if (req.query.city) {
      bikes = bikes.filter((bike) => {
        bike.locations = bike.locations.filter((location) => {
          return location.city.name == req.query.city;
        });

        return bike.locations.length > 0;
      });
    }

    if (req.query.pickuptime && req.query.dropofftime) {
      bikes = bikes.filter((bike) => {
        bike.locations = bike.locations.filter((location) => {
          console.log(location._id);
          let bookedSlots = bike.bookedSlots;
          let pt = new Date(req.query.pickuptime);
          let dt = new Date(req.query.dropofftime);
          let flag = true;
          for (let i = 0; i < bookedSlots.length; i++) {
            if (bookedSlots[i].location.toString() == location._id.toString()) {
              if (
                (bookedSlots[i].pickupTime > pt &&
                  bookedSlots[i].pickupTime > dt) ||
                (bookedSlots[i].dropoffTime < pt &&
                  bookedSlots[i].dropoffTime < dt)
              ) {
                console.log("flag true");
                continue;
              } else {
                flag = false;
                console.log("flag");
              }
            }
          }

          return flag;
        });

        return bike.locations.length > 0;
      });
    }

    // if(req.query.city){
    //   query = query.
    // }

    return res.status(200).send({ total: bikes.length, bikes });
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
