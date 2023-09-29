// controllers/VehicleController.js
const Vehicle = require("../schema/VehicleSchema");

class VehicleController {
  async createVehicle(req, res) {
    const { name, phoneNumbers, area, image } = req.body;

    try {
      // Create a new Vehicle document with the provided details
      const newVehicle = new Vehicle({
        name,
        phoneNumbers,
        area,
        image,
      });

      // Save the new vehicle document to MongoDB
      const savedVehicle = await newVehicle.save();

      res.status(201).json(savedVehicle);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getVehicle(req, res) {
    try {
      // Fetch data from the MongoDB collection named 'workers' in the 'test' database
      const vehicles = await Vehicle.find({});

      res.status(200).json(vehicles);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
module.exports = new VehicleController();
