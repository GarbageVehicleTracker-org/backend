const express = require("express");
const expressWs = require("express-ws");
const router = express.Router();
const PositionController = require("./controllers/PositionController");
const DriverController = require("./controllers/DriverController");
const VehicleController = require("./controllers/VehicleController");
const CurrentPositionController = require("./controllers/CurrentPositionController");
const AuthController = require("./controllers/AuthController");
const AssignedWorkController = require("./controllers/AssignedWorkController");
const AreaController = require("./controllers/AreaController");
const coordinatesMatchController = require("./controllers/CoordinatesMatchController");

// Create an expressWs instance and attach it to the app
const app = express();
expressWs(app);

const connectedClients = new Set();

// Welcome message for the home page
router.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the Home Page!" });
});

// WebSocket route to handle WebSocket connection
router.ws("/ws", (ws, req) => {
  // Handle WebSocket connection

  // For example, send a welcome message to the connected WebSocket client
  ws.send("Welcome to the WebSocket server!");
});

// Error handling middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Consistent JSON responses middleware
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

// Validation middleware for date parameter
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

// Route to handle sending driver data to MongoDB
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

// Route to fetch information about a specific area by name 
router.get("/get-area/:areaName?", AreaController.getAreaByName);

// Route to fetch a list of all areas
router.get("/get-all-areas", AreaController.getAllAreas);

// Route to fetch all dustbins in a specific area
router.get("/get-all-dustbins/:areaId?", AreaController.getAllDustbins);

// Route to fetch the count of dustbins in a specific area
router.get("/get-dustbin-count/:areaId?", AreaController.getDustbinCount);

// Route to fetch all assigned work
router.get("/get-all-assigned-work", AssignedWorkController.getAllAssignedWork);

// Update the current position
router.post("/update/:vehicleId?", CurrentPositionController.updatePosition);

// Fetch the current position
router.get("/get/:vehicleId?", CurrentPositionController.getPosition);

// Route to assign work
router.post("/assign-work", AssignedWorkController.assignWork);

// Authentication-protected route example
router.post("/protected-route", authenticateUser, (req, res) => {
  res.success("This route is protected");
});

// User login route
router.post("/login", AuthController.login);

router.post(
  "/check-coordinates-match",
  coordinatesMatchController.checkCoordinatesMatchController
);
router.post(
  "/send-real-coordinates/:vehicleId?",
  coordinatesMatchController.receiveCoordinatesMatchController
);

// WebSocket route to handle WebSocket connection
router.ws("/ws", (ws, req) => {
  // Add the new WebSocket connection to the set
  connectedClients.add(ws);

  // Handle the WebSocket connection close event
  ws.on("close", () => {
    connectedClients.delete(ws);
  });

  // Send a welcome message to the connected WebSocket client
  ws.send("Welcome to the WebSocket server!");
});

module.exports = router;
