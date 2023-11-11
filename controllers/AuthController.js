// controllers/AuthController.js
const bcrypt = require("bcrypt");
const User = require("../models/UserModel");

class AuthController {
  async login(req, res) {
    const { username, password } = req.body;

    try {
      // Find the user by username
      const user = await User.findOne({ username });

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Compare the entered password with the hashed password
      // const passwordMatch = await bcrypt.compare(password, user.password);

      if (password === user.password) {
        // Passwords match, user is authenticated
        res.status(200).json({ message: "Login successful" });
      } else {
        // Passwords do not match
        res.status(401).json({ error: "Invalid credentials" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = new AuthController();
