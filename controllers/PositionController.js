// controllers/PositionController.js
const Position = require("../schema/PositionSchema");
const moment = require("moment-timezone"); // Import moment-timezone

class PositionController {
  async createUser(req, res) {
    const { latitude, longitude, timestamp } = req.body;

    try {
      // Find an existing document or create a new one
      let position = await Position.findOne();

      if (!position) {
        position = new Position({ coordinates: [] });
      }

      // Parse the incoming timestamp as a moment object in "Asia/Kolkata" timezone
      const timestampMoment = moment(timestamp).tz("Asia/Kolkata");

      // Create a new coordinate object with the timestamp
      const newCoordinate = {
        latitude,
        longitude,
        timestamp: timestampMoment.toDate(), // Convert to JavaScript Date object
      };

      // Append the new coordinate to the array
      position.coordinates.push(newCoordinate);

      // Save the document with the updated coordinates
      const savedPosition = await position.save();

      res.status(201).json(savedPosition);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

async getCoordinates(req, res) {
    try {
      // Find the single document and return its coordinates array
      const position = await Position.findOne();
      const coordinates = position ? position.coordinates : [];

      // Convert the timestamps to "Asia/Kolkata" timezone format
      const coordinatesInIST = coordinates.map((coordinate) => {
        const timestampMoment = moment(coordinate.timestamp).tz("Asia/Kolkata");
        const formattedTimestamp = timestampMoment.format("YYYY-MM-DD HH:mm:ss");
        return {
          latitude: coordinate.latitude,
          longitude: coordinate.longitude,
          timestamp: formattedTimestamp,
          // timestamp: timestampMoment,
        };
      });

      res.status(200).json(coordinatesInIST);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}


module.exports = new PositionController();
