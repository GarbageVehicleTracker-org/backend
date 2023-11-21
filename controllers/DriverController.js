// controllers/DriverController.js
const Driver = require("../schema/DriverSchema");

class DriverController {
  async createDriver(req, res) {
    const { name, phoneNumbers, age, gender, image } = req.body;

    try {
      // Create a new Driver document with the provided details
      const newDriver = new Driver({
        name,
        phoneNumbers,
        age,
        gender,
        image,
      });

      // Save the new vehicle document to MongoDB
      const savedDriver = await newDriver.save();

      res.status(201).json(savedDriver);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getDriver(req, res) {
    try {
      // Fetch data from the MongoDB collection named 'workers' in the 'test' database
      const vehicles = await Driver.find({});

      res.status(200).json(vehicles);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
module.exports = new DriverController();
