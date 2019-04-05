const express = require("express");
const router = express.Router();

const Rental = require("../../../models/Rental");

const { authNeeded } = require("../../../middlewares/middlewares");

router.get("/", async (req, res) => {
  try {
    const rentals = await Rental.find({}).populate("bookings");
    if (rentals) {
      res.status(200).json(rentals);
    }
  } catch (err) {
    res.status(400).json({
      errors: [{ title: "Rentals Error!", detail: "Found 0 Rentals!" }]
    });
  }
});

router.get("/:id", authNeeded, async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id).populate(
      "bookings user"
    );
    if (rental) {
      res.status(200).json(rental);
    }
  } catch (err) {
    res.status(400).json({
      errors: [{ title: "Rental Error!", detail: "Could not find Rental!" }]
    });
  }
});

module.exports = router;
