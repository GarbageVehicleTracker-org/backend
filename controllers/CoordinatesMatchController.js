const fetch = require('node-fetch');
const Area = require('../schema/AreaSchema'); // Import the Mongoose model

// Function to fetch data from the API
async function fetchData(apiUrl) {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Propagate the error to handle it in the calling code
    }
}

async function checkCoordinatesMatchController(req, res) {
    const { areaId, vehicleId } = req.body;

    try {
        // Fetch data from the first API using areaId
        const areaData = await fetchData(`https://garbage-collect-backend.onrender.com/get-all-dustbins/${areaId}`);
        
        // Extract coordinates from the area data
        const areaCoordinates = areaData.map(area => area.coordinates).flat();

        // Fetch data from the second API using vehicleId
        const vehicleCoordinates = await fetchData(`https://garbage-collect-backend.onrender.com/get/${vehicleId}`);

        // Check if coordinates match
        const coordinatesMatch = areaCoordinates.some(areaCoord => (
            areaCoord.latitude === vehicleCoordinates.latitude &&
            areaCoord.longitude === vehicleCoordinates.longitude
        ));

        console.log('Coordinates:', areaCoordinates, vehicleCoordinates);
        console.log('Coordinates Match:', coordinatesMatch);

        if (coordinatesMatch) {
            // Update isVisited and visitedTimestamp in the database
            await Area.updateOne(
                {
                    areaId,
                    'dustbins.coordinates.latitude': vehicleCoordinates.latitude,
                    'dustbins.coordinates.longitude': vehicleCoordinates.longitude,
                },
                {
                    $set: {
                        'dustbins.$.isVisited': true,
                        'dustbins.$.visitedTimestamp': new Date(),
                    },
                }
            );

            // Schedule the automation task after 1 minute
            setTimeout(async () => {
                // Reset isVisited to false and visitedTimestamp to null
                await Area.updateOne(
                    {
                        areaId,
                        'dustbins.coordinates.latitude': vehicleCoordinates.latitude,
                        'dustbins.coordinates.longitude': vehicleCoordinates.longitude,
                    },
                    {
                        $set: {
                            'dustbins.$.isVisited': false,
                            'dustbins.$.visitedTimestamp': null,
                        },
                    }
                );
                console.log('Automation task completed.');
            }, 72000000); // 1 minute in milliseconds

            // Send a message if coordinates match
            res.status(200).json({ success: true, message: 'Coordinates matched!' });
        } else {
            res.status(200).json({ success: false, message: 'Coordinates do not match.' });
        }
    } catch (error) {
        console.error('Error checking coordinates match:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

module.exports = {
    checkCoordinatesMatchController,
};
