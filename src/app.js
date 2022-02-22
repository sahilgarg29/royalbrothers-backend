const express = require("express");
const citiesController = require("./controllers/cities.controller");
const locationsController = require("./controllers/locations.controller");

const app = express();
app.use(express.json());
app.use("/api/cities", citiesController);
app.use("/api/locations", locationsController);

module.exports = app;
