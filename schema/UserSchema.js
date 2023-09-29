const mongoose = require("mongoose");

// Define the user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  //   image: {
  //     type: String, // You can store the image URL as a string
  //   },
  phoneNumber: {
    type: String,
  },
  coordinates: [
    {
      latitude: Number,
      longitude: Number,
    },
  ],
});

// Create the User model
const User = mongoose.model("User", userSchema);

module.exports = User;
