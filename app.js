const express = require("express");
const mongodb = require("mongodb");
const cors = require("cors");

const app = express();
const port = 5500;
const mongoUri =
  "mongodb+srv://garbagevehicletracker:Bodda_priyam_deep%40rahul69@garbage-vehicle-trackin.lq7esop.mongodb.net/?retryWrites=true&w=majority";

// Create a global variable to store coordinates
let currentCoordinates = {};

// MongoDB client
const client = new mongodb.MongoClient(mongoUri);

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable CORS for all routes

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal server error");
});

// Route to handle incoming coordinates
app.post("/send-coordinates", (req, res) => {
  const { latitude, longitude } = req.body;
  console.log(
    `Received coordinates: Latitude ${latitude}, Longitude ${longitude}`
  );

  // Store the received coordinates
  currentCoordinates = {
    name: "iss",
    id: 25544,
    latitude,
    longitude,
  };

  res.sendStatus(200);
});

// Route to respond to GET request with current coordinates
app.get("/get-coordinates", (req, res) => {
  res.json(currentCoordinates);
});

app.get("/", (req, res) => {
  console.log("Hello Linux team!");
  res.send("Welcome");
});

// Define a route for the home page
app.get("/vehicles", async (req, res, next) => {
  try {
    await client.connect();
    const db = client.db("vehicles");
    const collection = db.collection("workers");
    const data = await collection.find({}).toArray();
    res.send(data);
  } catch (err) {
    next(err); // Pass the error to the error handling middleware
  }
});

// Start the server
client.connect().then(() => {
  app.listen(port, () => {
    console.log("Listening on port ", port);
  });
});
