// vehicleSchema.js
const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  registrationNo: {
    type: String,
    required: true,
  },
  // color: {
  //   type: String,
  // },
  // image: {
  //   type: String,
  // },
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

module.exports = Vehicle;
