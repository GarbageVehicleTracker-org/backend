const fetch = require("node-fetch");
const Area = require("../schema/AreaSchema"); // Import the Mongoose model

// Function to fetch data from the API
async function fetchData(apiUrl) {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Propagate the error to handle it in the calling code
  }
}

async function checkCoordinatesMatchController(req, res) {
  const { areaId, vehicleId } = req.body;

  try {
    // Fetch data from the first API using areaId
    const areaData = await fetchData(
      `https://garbage-collect-backend.onrender.com/get-all-dustbins/${areaId}`
    );

    // Extract coordinates from the area data
    const areaCoordinates = areaData.map((area) => area.coordinates).flat();

    // Fetch data from the second API using vehicleId
    const vehicleCoordinates = await fetchData(
      `https://garbage-collect-backend.onrender.com/get/${vehicleId}`
    );

    // Check if coordinates match
    const coordinatesMatch = areaCoordinates.some(
      (areaCoord) =>
        areaCoord.latitude === vehicleCoordinates.latitude &&
        areaCoord.longitude === vehicleCoordinates.longitude
    );

    console.log("Coordinates:", areaCoordinates, vehicleCoordinates);
    console.log("Coordinates Match:", coordinatesMatch);

    if (coordinatesMatch) {
      // Update isVisited and visitedTimestamp in the database
      await Area.updateOne(
        {
          areaId,
          "dustbins.coordinates.latitude": vehicleCoordinates.latitude,
          "dustbins.coordinates.longitude": vehicleCoordinates.longitude,
        },
        {
          $set: {
            "dustbins.$.isVisited": true,
            "dustbins.$.visitedTimestamp": new Date(),
          },
        }
      );

      // Send a message if coordinates match
      res.status(200).json({ success: true, message: "Coordinates matched!" });
    } else {
      res
        .status(200)
        .json({ success: false, message: "Coordinates do not match." });
    }
  } catch (error) {
    console.error("Error checking coordinates match:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

// Define receiveCoordinatesMatchController separately

async function receiveCoordinatesMatchController(req, res) {
  const { vehicleId } = req.params; // Extract vehicleId from URL parameters
  let { latitude, longitude } = req.body;

  console.log(vehicleId);

  // Check for undefined values
  if (latitude === undefined || longitude === undefined) {
    return res.status(400).json({ error: "latitude or longitude is missing." });
  }

  // Function to check coordinates match and update if necessary
  const checkAndUpdateCoordinates = async () => {
    const areaData = await fetchData(
      "https://garbage-collect-backend.onrender.com/get-all-areas"
    );

    try {
      // Extract coordinates from the area data
      const areaCoordinates = areaData.flatMap((area) =>
        area.dustbins.map((dustbin) => dustbin.coordinates)
      );

      // Check if coordinates match
      const coordinatesMatch = areaCoordinates.some(
        (areaCoord) =>
          areaCoord.latitude === latitude && areaCoord.longitude === longitude
      );

      console.log("Coordinates Match:", coordinatesMatch);

      if (coordinatesMatch) {
        // Update isVisited and visitedTimestamp in the database
        await Area.updateOne(
          {
            areaId,
            "dustbins.coordinates.latitude": latitude,
            "dustbins.coordinates.longitude": longitude,
          },
          {
            $set: {
              "dustbins.$.isVisited": true,
              "dustbins.$.visitedTimestamp": new Date(),
            },
          }
        );

        // Send a message if coordinates match
        res
          .status(200)
          .json({ success: true, message: "Coordinates matched!" });
      } else {
        res
          .status(200)
          .json({ success: false, message: "Coordinates do not match." });
      }
    } catch (error) {
      console.error("Error checking coordinates match:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  };

  // Call the function immediately
  checkAndUpdateCoordinates();

  // Set up interval to check and update coordinates every 1 second
  const intervalId = setInterval(checkAndUpdateCoordinates, 1000);

  // Optional: Stop the interval after a specific duration (e.g., 10 seconds)
  setTimeout(() => clearInterval(intervalId), 10000);
}

module.exports = {
  checkCoordinatesMatchController,
  receiveCoordinatesMatchController,
};
