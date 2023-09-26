const express = require("express");
const mongodb = require("mongodb");
const cors = require("cors"); // Import the cors middleware
const port = 5500;
const app = express();
const mongoUri =
  "mongodb+srv://garbagevehicletracker:Bodda_priyam_deep%40rahul69@garbage-vehicle-trackin.lq7esop.mongodb.net/?retryWrites=true&w=majority";

const client = new mongodb.MongoClient(mongoUri);

app.use(express.json()); // Parse JSON request bodies

// Enable CORS for all routes
app.use(cors());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal server error");
});

// Define a route for the home page
app.get("/vehicles", async (req, res, next) => {
  // Add 'next' parameter here
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
app.listen(port, () => {
  console.log("Listening on port ", port);
});
