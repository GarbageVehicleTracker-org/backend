// vehicleController.js
const Vehicle = require("../schema/VehicleSchema"); // Assuming your model is in a 'models' directory

class VehicleController {
  async createVehicle(req, res) {
    const { id, capacity, type, registrationNo } = req.body;

    try {
      // Check if a vehicle with the same ID already exists
      const existingVehicle = await Vehicle.findOne({ id });

      if (existingVehicle) {
        return res
          .status(400)
          .json({ error: "Vehicle with this ID already exists." });
      }

      // Create a new vehicle
      const newVehicle = new Vehicle({
        id,
        capacity,
        type,
        registrationNo,
      });

      // Save the vehicle to the database
      const savedVehicle = await newVehicle.save();

      res.status(201).json(savedVehicle);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getVehicle(req, res) {
    try {
      // Fetch all vehicles from the database
      const vehicles = await Vehicle.find();

      res.status(200).json(vehicles);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = new VehicleController();
