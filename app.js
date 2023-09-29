// app.js
const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const mongoose = require("mongoose");
const { mongoUri } = require("./config");
const app = express();
const port = 5500;

// Connect to MongoDB using the mongoUri
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(cors());

app.use("/", routes);

app.listen(port, () => {
  console.log("Server is running on port", port);
});
