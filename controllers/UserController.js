// controllers/UserController.js
const User = require("../schema/UserSchema");

class UserController {
  async createUser(req, res) {
    const { latitude, longitude, username, phoneNumber } = req.body;

    try {
      const newUser = new User({
        username,
        phoneNumber,
        coordinates: [{ latitude, longitude }],
      });

      const savedUser = await newUser.save();

      res.status(201).json(savedUser);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getCoordinates(req, res) {
    try {
      // Find all user documents and project only the coordinates
      const coordinates = await User.find({}, "coordinates");

      res.status(200).json(coordinates);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = new UserController();
