// app.js is now named as index.js
const express = require("express");
const cors = require("cors");
const http = require("http");
const cron = require('node-cron');
const WebSocket = require("ws");
const routes = require("./routes");
const AutomationController = require("./controllers/AutomationController")
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const { mongoUri } = require("./config");
const app = express();
const port = 5500;
const server = http.createServer(app);
// WebSocket server
const wss = new WebSocket.Server({ noServer: true });

// WebSocket connection handling
wss.on("connection", (ws) => {
  console.log("WebSocket client connected");

  // Handle messages from WebSocket clients
  ws.on("message", (message) => {
    console.log(`Received WebSocket message: ${message}`);

    // Process the message and send a response if needed

    // For example, broadcast the message to all connected clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(`Broadcast from server: ${message}`);
      }
    });
  });

  // Handle WebSocket client disconnection
  ws.on("close", () => {
    console.log("WebSocket client disconnected");
  });
});



const automationController = new AutomationController();

// Start the automation task after 1 minute
automationController.startAutomationTask();

// Start the nightly automation task
automationController.startNightlyAutomationTask();



// Connect to MongoDB using the mongoUri
mongoose
  .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => console.error("Error connecting to MongoDB:", error));

app.use(express.json());
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use("/", routes);

// Attach the WebSocket server to the existing HTTP server
server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

// Start the HTTP server
server.listen(port, () => {
  console.log("Server is running on port", port);
});
