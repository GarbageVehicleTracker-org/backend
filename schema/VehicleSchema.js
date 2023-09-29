const mongoose = require("mongoose");

// Define the vehicle schema
const vehicleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumbers: {
    type: String,
    required: true,
  },
  area: {
    type: String,
  },
  image: {
    type: String, // You can store the image URL as a string
  },
});

// Create the Vehicle model (collection name: workers)
const Vehicle = mongoose.model("Worker", vehicleSchema);

module.exports = Vehicle;
