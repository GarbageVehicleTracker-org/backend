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

    async getAllAssignedWork(req, res) {
        try {
            const allAssignedWork = await AssignedWork.find();
            res.status(200).json(allAssignedWork);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}

module.exports = new AssignedWorkController();
