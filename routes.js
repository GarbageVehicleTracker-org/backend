// routes.js
const express = require("express");
const router = express.Router();
const UserController = require("./controllers/UserController");
const VehicleController = require("./controllers/VehicleController");

// Define a route for the home page (not implemented yet)
router.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the Home Page!" });
});

// Route to handle incoming coordinates and user details
router.post("/send-coordinates", UserController.createUser);

// Route to respond to GET request with current coordinates
router.get("/get-coordinates", UserController.getCoordinates);

// Route to handle sending vehicle data to MongoDB
router.post("/send-vehicle", VehicleController.createVehicle);

// Route to retrieve vehicle coordinates (GET request)
router.get("/get-vehicle", VehicleController.getVehicle);

module.exports = router;
