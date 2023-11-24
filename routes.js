const AreaController = require("./controllers/AreaController");
const Area = require("./schema/AreaSchema");
const express = require("express");
const router = express.Router();
const PositionController = require("./controllers/PositionController");
const DriverController = require("./controllers/DriverController");
const VehicleController = require("./controllers/VehicleController");
const CurrentPositionController = require("./controllers/CurrentPositionController");
const AuthController = require("./controllers/AuthController");
const AssignedWorkController = require("./controllers/AssignedWorkController");

// Define a route for the home page (not implemented yet)
router.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the Home Page!" });
});

// Error handling middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Consistent JSON responses
router.use((req, res, next) => {
  res.success = (data) => res.status(200).json({ success: true, data });
  res.error = (message) =>
    res.status(400).json({ success: false, error: message });
  next();
});

// User authentication middleware (example)
const authenticateUser = (req, res, next) => {
  // Implement your authentication logic here
  // If authentication fails, return res.error('Unauthorized');

  // If authentication is successful, call next()
  next();
};

const validateDateParameter = (req, res, next) => {
  const { date } = req.params;
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (date && !date.match(dateRegex)) {
    return res.error("Invalid date format. Use YYYY-MM-DD.");
  }

  next();
};

// Route to handle incoming coordinates and user details
router.post("/send-coordinates", PositionController.createUser);

// Route to respond to GET request with current coordinates
router.get(
  "/get-coordinates/:userId/:date?",
  validateDateParameter,
  PositionController.getCoordinates
);

// Route to handle sending vehicle data to MongoDB
router.post("/send-driver", DriverController.createDriver);

// Route to fetch individual or all drivers
router.get("/get-driver/:driverId?", DriverController.getDriver);

// Route to handle sending vehicle data to MongoDB
router.post("/send-vehicle", VehicleController.createVehicle);

// Route to fetch individual or all vehicles
router.get("/get-vehicle/:id?", VehicleController.getVehicle);

// Route to create a new area
router.post("/create-area", AreaController.createArea);

// Route to add a new garbage point to a specific dustbin within an area
router.post("/add-dustbin-point", AreaController.addDustbin);

router.get("/get-area/:areaName?", AreaController.getAreaByName);

// Route to fetch a list of all areas
router.get("/get-all-areas", AreaController.getAllAreas);

router.get("/get-all-dustbins/:areaId?", AreaController.getAllDustbins);

router.get("/get-dustbin-count/:areaId?", AreaController.getDustbinCount);

router.get("/get-all-assigned-work", AssignedWorkController.getAllAssignedWork);

// Update the current position

router.post("/update/:userId?", CurrentPositionController.updatePosition);

// Fetch the current position
router.get("/get/:userId?", CurrentPositionController.getPosition);

router.post("/assign-work", AssignedWorkController.assignWork);

// Authentication-protected route example
router.post("/protected-route", authenticateUser, (req, res) => {
  res.success("This route is protected");
});

router.post("/login", AuthController.login);

module.exports = router;
