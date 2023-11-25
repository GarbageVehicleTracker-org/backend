
const mongoose = require("mongoose");

const dustbinSchema = new mongoose.Schema({
  coordinates: [
    {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },
  ],
  // New boolean field
  isVisited: {
    type: Boolean,
    required: true,
    default: false,
  },
  // New timestamp field
  visitedTimestamp: {
    type: Date,
    default: null,
  },
});

const areaSchema = new mongoose.Schema({
  areaId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  dustbins: [dustbinSchema],
});

const Area = mongoose.model("Area", areaSchema);

module.exports = Area;

