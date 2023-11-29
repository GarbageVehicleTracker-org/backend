// controllers/CurrentPositionController.js
const admin = require("../firebase");

// Assuming connectedClients is defined globally or imported from another module
let connectedClients = []; // Make sure it's initialized appropriately

class CurrentPositionController {
  async updatePosition(req, res) {
    const { vehicleId } = req.params;
    const { latitude, longitude } = req.body;

    console.log(vehicleId);

    // Check for undefined values
    if (latitude === undefined || longitude === undefined) {
      return res
        .status(400)
        .json({ error: "latitude or longitude is missing." });
    }

    try {
      // Assuming you have a reference to your Firebase Realtime Database
      const db = admin.database();
      const positionRef = db.ref(`positions/${vehicleId}/current_position`);

      // Set the values in the database
      await positionRef.set({
        latitude,
        longitude,
        timestamp: new Date().toISOString(),
      });

      // Emit a message to all connected clients when the position is updated
      const message = {
        type: "positionUpdate",
        data: { vehicleId, latitude, longitude },
      };

      // Iterate over connectedClients and send the message to each client
      connectedClients.forEach((client) => {
        client.send(JSON.stringify(message));
      });

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error updating position:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getPosition(req, res) {
    try {
      const { vehicleId } = req.params;

      // Get the latest position data from Firebase based on userId
      const snapshot = await admin
        .database()
        .ref(`positions/${vehicleId}/current_position`)
        .once("value");

      // Check if the snapshot exists and has a value
      if (snapshot.exists()) {
        const currentPosition = snapshot.val();

        // Respond with the latest position data
        return res.status(200).json(currentPosition);
      } else {
        return res.status(404).json({ error: "Position data not found." });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = new CurrentPositionController();
