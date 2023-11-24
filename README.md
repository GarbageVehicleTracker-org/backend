# backend
backend code of garbagevehicletracker

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
