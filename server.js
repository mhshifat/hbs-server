const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true }, () => {
  console.log(`==> A database connection has been established`);
});
mongoose.set("useCreateIndex", "true");

const rentalsRoutes = require("./routes/api/v1/rentals");
const usersRoutes = require("./routes/api/v1/users");
const bookingsRoutes = require("./routes/api/v1/bookings");

const { port } = require("./config/config");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.use("/api/v1/rentals", rentalsRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/bookings", bookingsRoutes);

app.listen(port, () => {
  console.log(`==> The server is running on http://localhost:${port}`);
});
