const moment = require("moment");
const express = require("express");
const router = express.Router();

const Rental = require("../../../models/Rental");
const Booking = require("../../../models/Booking");
const User = require("../../../models/User");

const { authNeeded } = require("../../../middlewares/middlewares");

router.post("/", authNeeded, async (req, res) => {
  try {
    const { startAt, endAt, totalPrice, guests, days, rental } = req.body;
    const userId = req.user._id;
    const findRental = await Rental.findById(rental).populate("bookings user");
    if (String(findRental.user._id) === String(userId)) {
      return res.status(400).json({
        errors: [
          {
            title: "Booking Error!",
            detail: "Cannot create booking on your own rental!"
          }
        ]
      });
    }
    let isValid = true;
    if (findRental.bookings && findRental.bookings.length > 0) {
      isValid = findRental.bookings.every(booking => {
        const ps = moment(startAt);
        const pe = moment(endAt);
        const as = moment(booking.startAt);
        const ae = moment(booking.endAt);

        if ((as < ps && ae < ps) || (pe < ae && pe < as)) {
          return true;
        } else {
          return false;
        }
      });
    }
    if (!isValid) {
      return res.status(400).json({
        errors: [{ title: "Booking Error!", detail: "Date has already taken!" }]
      });
    }
    const booking = {
      startAt,
      endAt,
      totalPrice,
      guests,
      days,
      user: String(userId),
      rental: String(findRental.user._id)
    };
    const createBooking = await Booking.create(booking);
    findRental.bookings.push(createBooking);
    findRental.save();
    const updateUser = await User.findByIdAndUpdate(
      String(userId, { $push: { bookings: booking } })
    );
    return res.json({ success: true });
  } catch (err) {
    res.status(400).json({
      errors: [{ title: "Random Error!", detail: "Something went wrong!" }]
    });
  }
});

module.exports = router;
