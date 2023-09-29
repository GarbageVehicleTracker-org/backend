const mongoose = require("mongoose");
const moment = require("moment-timezone");

const positionSchema = new mongoose.Schema({
  coordinates: [
    {
      latitude: Number,
      longitude: Number,
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

positionSchema.virtual("coordinates.timestampIST").get(function () {
  return moment(this.coordinates.timestamp).tz("Asia/Kolkata").format();
});

const Position = mongoose.model("Position", positionSchema);

module.exports = Position;
