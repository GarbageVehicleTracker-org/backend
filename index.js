// app.js
const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const mongoose = require("mongoose");
const { mongoUri } = require("./config");
const app = express();
const port = 5500;
const AreaController = require('./controllers/AreaController');

// Connect to MongoDB using the mongoUri
// Connect to MongoDB
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    // Start the automation task
    AreaController.startAutomationTask();
  })
  .catch((error) => console.error('Error connecting to MongoDB:', error));

app.use(express.json());
app.use(cors());

app.use("/", routes);

app.listen(port, () => {
  console.log("Server is running on port", port);
});
