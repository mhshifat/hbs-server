const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    min: [4, "Too short, min is 4 characters"],
    max: [32, "Too short, max is 32 characters"]
  },
  email: {
    type: String,
    min: [4, "Too short, min is 4 characters"],
    max: [32, "Too short, max is 32 characters"],
    unique: true,
    lowercase: true,
    required: "Email is required",
    match: [/^([a-zA-Z0-9_\-\.]{1,})@([a-zA-Z0-9_\-\.]{1,})\.([a-zA-Z]{2,3})$/]
  },
  password: {
    type: String,
    min: [4, "Too short, min is 4 characters"],
    max: [32, "Too short, max is 32 characters"],
    required: "Password is required"
  },
  rentals: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rental"
    }
  ],
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking"
    }
  ]
});

userSchema.methods.isPwdValid = async function(password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.pre("save", async function(next) {
  this.password = await bcrypt.hash(this.password, 15);
  next();
});

module.exports = mongoose.model("User", userSchema);
