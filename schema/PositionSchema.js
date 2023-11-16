const mongoose = require("mongoose");
const moment = require("moment-timezone");

const positionSchema = new mongoose.Schema({
  coordinates: [
    {
      userId: String,
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
  const utcTimestamp = this.coordinates.timestamp;
  const istTimestamp = moment(utcTimestamp).tz("Asia/Kolkata").toDate();
  return istTimestamp;
});

const Position = mongoose.model("Position", positionSchema);

module.exports = Position;
