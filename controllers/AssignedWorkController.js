// AssignedWorkController.js
const AssignedWork = require("../schema/AssignedWorkSchema");

class AssignedWorkController {
    async assignWork(req, res) {
        const { areaId, driverId, vehicleId } = req.body;

        try {
            const assignedWork = new AssignedWork({
                areaId,
                driverId,
                vehicleId,
            });

            const savedAssignedWork = await assignedWork.save();

            res.status(201).json(savedAssignedWork);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    // Add other methods as needed
}

module.exports = new AssignedWorkController();
