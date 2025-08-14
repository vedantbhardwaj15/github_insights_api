const express = require("express");
const morgan = require("morgan");
const insightsRoutes = require("./routes/insightsRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/insights", insightsRoutes);

module.exports = app;
