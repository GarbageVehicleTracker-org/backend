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

    // console.log("Coordinates:", areaCoordinates, vehicleCoordinates);
    // console.log("Coordinates Match:", coordinatesMatch);

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

// async function receiveCoordinatesMatchController(req, res) {
//   const { vehicleId } = req.params;
//   let { latitude, longitude } = req.body;

//   console.log(vehicleId);
//   console.log(latitude, longitude);

//   // Convert latitude and longitude to numbers
//   latitude = parseFloat(latitude);
//   longitude = parseFloat(longitude);
//   // Check for undefined or invalid values
//   if (isNaN(latitude) || isNaN(longitude)) {
//     return res.status(400).json({ error: "Invalid latitude or longitude." });
//   }

//   try {
//     // Fetch assigned work data
//     const assignedWorkData = await fetchData(
//       "https://garbage-collect-backend.onrender.com/get-all-assigned-work"
//     );

//     // Find the assigned work for the current vehicleId
//     const assignedWork = assignedWorkData.find(
//       (work) => work.vehicleId === vehicleId
//     );

//     if (!assignedWork) {
//       console.log("Vehicle not assigned to any area.");
//       return res
//         .status(400)
//         .json({ error: "Vehicle not assigned to any area." });
//     }

//     const areaId = assignedWork.areaId;

//     // Fetch dustbins for the given area
//     const area = await Area.findOne({ areaId });

//     if (!area) {
//       console.log("Area not found.");
//       return res.status(404).json({ error: "Area not found." });
//     }

//     // Extract coordinates from the dustbin data
//     const matchingDustbins = [];

//     for (const dustbin of area.dustbins) {
//       // Check each coordinate in the dustbin
//       const coordinatesMatch = dustbin.coordinates.some(
//         (coord) => coord.latitude === latitude && coord.longitude === longitude
//       );

//       if (coordinatesMatch) {
//         console.log("coordinates matched");
//         matchingDustbins.push(dustbin);
//       } else {
//         console.log("coordinates not matched");
//       }
//     }

//     // console.log("Matching Dustbins:", matchingDustbins);

//     if (matchingDustbins.length > 0) {
//       // Update isVisited and visitedTimestamp in the database
//       for (const matchingDustbin of matchingDustbins) {
//         await Area.updateOne(
//           {
//             areaId,
//             "dustbins._id": matchingDustbin._id, // Match by dustbin ID
//           },
//           {
//             $set: {
//               "dustbins.$.isVisited": true,
//               "dustbins.$.visitedTimestamp": new Date(),
//             },
//           }
//         );
//       }

//       // Send a message if coordinates match
//       return res
//         .status(200)
//         .json({ success: true, message: "Coordinates matched!" });
//     } else {
//       // Send a message if coordinates do not match
//       return res
//         .status(200)
//         .json({ success: false, message: "Coordinates do not match." });
//     }
//   } catch (error) {
//     console.error("Error checking coordinates match:", error);
//     return res
//       .status(500)
//       .json({ success: false, error: "Internal server error" });
//   }
// }


async function receiveCoordinatesMatchController(req, res) {
  const { vehicleId } = req.params;
  let { latitude, longitude } = req.body;

  console.log(vehicleId);
  console.log(latitude, longitude);

  // Convert latitude and longitude to numbers
  latitude = parseFloat(latitude);
  longitude = parseFloat(longitude);
  // Check for undefined or invalid values
  if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ error: "Invalid latitude or longitude." });
  }

  try {
    // Fetch assigned work data
    const assignedWorkData = await fetchData(
      "https://garbage-collect-backend.onrender.com/get-all-assigned-work"
    );

    // Find the assigned work for the current vehicleId
    const assignedWork = assignedWorkData.find(
      (work) => work.vehicleId === vehicleId
    );

    if (!assignedWork) {
      console.log("Vehicle not assigned to any area.");
      return res
        .status(400)
        .json({ error: "Vehicle not assigned to any area." });
    }

    const areaId = assignedWork.areaId;

    // Fetch dustbins for the given area
    const area = await Area.findOne({ areaId });

    if (!area) {
      console.log("Area not found.");
      return res.status(404).json({ error: "Area not found." });
    }

    // Extract coordinates from the dustbin data
    const matchingDustbins = [];

    for (const dustbin of area.dustbins) {
      // Check each coordinate in the dustbin
      const coordinatesMatch = dustbin.coordinates.some(
        (coord) =>
          parseFloat(coord.latitude.toFixed(5)) ===
            parseFloat(latitude.toFixed(5)) &&
          parseFloat(coord.longitude.toFixed(5)) ===
            parseFloat(longitude.toFixed(5))
      );

      if (coordinatesMatch) {
        console.log("coordinates matched");
        matchingDustbins.push(dustbin);
      } else {
        console.log("coordinates not matched");
      }
    }

    // console.log("Matching Dustbins:", matchingDustbins);

    if (matchingDustbins.length > 0) {
      // Update isVisited and visitedTimestamp in the database
      for (const matchingDustbin of matchingDustbins) {
        await Area.updateOne(
          {
            areaId,
            "dustbins._id": matchingDustbin._id, // Match by dustbin ID
          },
          {
            $set: {
              "dustbins.$.isVisited": true,
              "dustbins.$.visitedTimestamp": new Date(),
            },
          }
        );
      }

      // Send a message if coordinates match
      return res
        .status(200)
        .json({ success: true, message: "Coordinates matched!" });
    } else {
      // Send a message if coordinates do not match
      return res
        .status(200)
        .json({ success: false, message: "Coordinates do not match." });
    }
  } catch (error) {
    console.error("Error checking coordinates match:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
}




module.exports = {
  checkCoordinatesMatchController,
  receiveCoordinatesMatchController,
};
