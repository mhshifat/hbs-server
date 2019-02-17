const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    max: [128, "Too long, Max is 128 characters"]
  },
  city: {
    type: String,
    require: true,
    lowercase: true
  },
  street: {
    type: String,
    required: true,
    min: [4, "Too short, Min is 4 characters"]
  },
  city: {
    type: String,
    require: true,
    lowercase: true
  },
  image: {
    type: String,
    require: true
  },
  bedrooms: Number,
  shared: Boolean,
  description: {
    type: String,
    require: true
  },
  dailyRate: Number,
  createdAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking"
    }
  ]
});

module.exports = mongoose.model("Rental", rentalSchema);
