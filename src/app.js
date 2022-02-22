const express = require("express");
const citiesController = require("./controllers/cities.controller");
const locationsController = require("./controllers/locations.controller");
const bikesController = require("./controllers/bikes.controller");
const { login, register } = require("./controllers/auth.controller");
const app = express();
app.use(express.json());
app.use("/api/cities", citiesController);
app.use("/api/locations", locationsController);
app.use("/api/bikes", bikesController);
app.use("/api/login", login);
app.use("/api/register", register);

module.exports = app;
