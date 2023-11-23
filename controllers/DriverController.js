// controllers/DriverController.js
const Driver = require("../schema/DriverSchema");

class DriverController {
  async createDriver(req, res) {
    const { driverId, name, phoneNumbers, age, gender, image } = req.body;

    try {
      // Create a new Driver document with the provided details
      const newDriver = new Driver({
        driverId,
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
    const { driverId } = req.params;
    console.log(driverId)
    try {
        // If driverId is provided, fetch individual driver
        if (driverId) {
            const driver = await Driver.findOne({ driverId });
            if (!driver) {
                return res.status(404).json({ error: "Driver not found" });
            }
            return res.status(200).json(driver);
        }

        // If no driverId is provided, fetch all drivers
        const allDrivers = await Driver.find();
        res.status(200).json(allDrivers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}


}
module.exports = new DriverController();
