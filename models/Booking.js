const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  endAt: {
    type: Date,
    required: true
  },
  startAt: {
    type: Date,
    required: true
  },
  totalPrice: Number,
  days: Number,
  guests: Number,
  createdAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  rental: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Rental"
  }
});

module.exports = mongoose.model("Booking", bookingSchema);
