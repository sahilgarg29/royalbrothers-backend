const express = require("express");
const citiesController = require("./src/controllers/cities.controller");
const locationsController = require("./src/controllers/locations.controller");
const bikesController = require("./src/controllers/bikes.controller");
const bookingsController = require("./src/controllers/bookings.controller");
const { login, register } = require("./src/controllers/auth.controller");
const cors = require("cors");
const app = express();
app.use(cors());
app.options("*", cors());
app.use(express.json());
app.use("/api/cities", citiesController);
app.use("/api/locations", locationsController);
app.use("/api/bikes", bikesController);
app.use("/api/login", login);
app.use("/api/register", register);
app.use("/api/book", bookingsController);

module.exports = app;
