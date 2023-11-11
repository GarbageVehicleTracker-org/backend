// controllers/CurrentPositionController.js
const admin = require("../firebase");

class CurrentPositionController {
  async updatePosition(req, res) {
    const { latitude, longitude } = req.body;

    // Check for undefined values
    if (latitude === undefined || longitude === undefined) {
      return res
        .status(400)
        .json({ error: "Latitude or longitude is missing." });
    }

    try {
      // Assuming you have a reference to your Firebase Realtime Database
      const db = admin.database();
      const positionRef = db.ref("positions/user1/current_position");

      // Set the values in the database
      await positionRef.set({
        latitude,
        longitude,
        timestamp: new Date().toISOString(),
      });

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error updating position:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  //   async getPosition(req, res) {
  //     try {
  //       // Get the latest position data from Firebase
  //       const snapshot = await admin
  //         .database()
  //         .ref("positions/user1/current_position") // Correct path here
  //         .once("value");
  //       const currentPosition = snapshot.val();

  //       // Check if position data exists
  //       if (!currentPosition) {
  //         return res.status(404).json({ error: "Position data not found." });
  //       }

  //       // Respond with the latest position data
  //       res.status(200).json(currentPosition);
  //     } catch (err) {
  //       console.error(err);
  //       res.status(500).json({ error: "Internal server error" });
  //     }
  //   }

  async getPosition(req, res) {
    try {
      // Get the latest position data from Firebase
      const snapshot = await admin
        .database()
        .ref("positions/user1/current_position")
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
