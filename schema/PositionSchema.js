const mongoose = require("mongoose");

// Define the user schema
const positionSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  coordinates: [
    {
      latitude: Number,
      longitude: Number,
    },
  ],
});

// Create the User model
const User = mongoose.model("position", positionSchema);

module.exports = User;
