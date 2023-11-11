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

  // async getCoordinates(req, res) {
  //   try {
  //     // Find the single document
  //     const position = await Position.findOne();

  //     if (!position) {
  //       return res.status(200).json([]);
  //     }

  //     // Get the current timestamp in "Asia/Kolkata" timezone
  //     const currentTimestamp = moment().tz("Asia/Kolkata").startOf("day");

  //     // Filter the coordinates based on the same day timestamp
  //     const matchingCoordinates = position.coordinates.filter((coordinate) => {
  //       const coordinateTimestamp = moment(coordinate.timestamp)
  //         .tz("Asia/Kolkata")
  //         .startOf("day");
  //       return coordinateTimestamp.isSame(currentTimestamp);
  //     });

  //     // Convert the timestamps to "Asia/Kolkata" timezone format
  //     const coordinatesInIST = matchingCoordinates.map((coordinate) => {
  //       const timestampMoment = moment(coordinate.timestamp).tz("Asia/Kolkata");
  //       const formattedTimestamp = timestampMoment.format(
  //         "YYYY-MM-DD HH:mm:ss"
  //       );
  //       return {
  //         latitude: coordinate.latitude,
  //         longitude: coordinate.longitude,
  //         timestamp: formattedTimestamp,
  //       };
  //     });

  //     res.status(200).json(coordinatesInIST);
  //   } catch (err) {
  //     console.error(err);
  //     res.status(500).json({ error: "Internal server error" });
  //   }
  // }



async getCoordinates(req, res) {
    try {
        // Find the single document
        const position = await Position.findOne();

        if (!position) {
            return res.status(200).json([]);
        }

        // Get the date parameter from the request, or use the current date if not provided
        const requestedDate = req.query.date || moment().tz("Asia/Kolkata").format("YYYY-MM-DD");

        // Parse the requested date in "Asia/Kolkata" timezone
        const requestedDateMoment = moment(requestedDate, "YYYY-MM-DD").tz("Asia/Kolkata").startOf('day');

        // Filter the coordinates based on the requested date timestamp
        const matchingCoordinates = position.coordinates.filter(coordinate => {
            const coordinateTimestamp = moment(coordinate.timestamp).tz("Asia/Kolkata").startOf('day');
            return coordinateTimestamp.isSame(requestedDateMoment);
        });

        // Convert the timestamps to "Asia/Kolkata" timezone format
        const coordinatesInIST = matchingCoordinates.map(coordinate => {
            const timestampMoment = moment(coordinate.timestamp).tz("Asia/Kolkata");
            const formattedTimestamp = timestampMoment.format("YYYY-MM-DD HH:mm:ss");
            return {
                latitude: coordinate.latitude,
                longitude: coordinate.longitude,
                timestamp: formattedTimestamp,
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
