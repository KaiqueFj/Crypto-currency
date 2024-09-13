const express = require("express");
const path = require("path");
const rateLimit = require("express-rate-limit");
const viewRoutes = require("./routes/viewRoutes");
const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "/views"));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(express.static(path.join(`${__dirname}/public`)));

// Limit requests from the same api
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this Ip, please try again in an hour",
});

app.use("/api", limiter);
app.use("/", viewRoutes);

module.exports = app;
