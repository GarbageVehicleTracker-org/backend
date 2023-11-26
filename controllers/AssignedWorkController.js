// AssignedWorkController.js
const AssignedWork = require("../schema/AssignedWorkSchema");

class AssignedWorkController {
  async assignWork(req, res) {
    const { areaId, driverId, vehicleId } = req.body;

    try {
      // Check if there is existing assigned work for the given areaId
      const existingAssignedWork = await AssignedWork.findOne({ areaId });

      if (existingAssignedWork) {
        // Check if the existing assigned work has the same driverId and vehicleId
        if (
          existingAssignedWork.driverId === driverId &&
          existingAssignedWork.vehicleId === vehicleId
        ) {
          // Do nothing if driverId and vehicleId match
          return res.status(200).json(existingAssignedWork);
        } else {
          // Update the existing assigned work with the new driverId and vehicleId
          const updatedAssignedWork = await AssignedWork.findOneAndUpdate(
            { areaId },
            { driverId, vehicleId },
            { new: true }
          );

          return res.status(200).json(updatedAssignedWork);
        }
      } else {
        // Create a new assigned work if no existing work for the given areaId
        const assignedWork = new AssignedWork({
          areaId,
          driverId,
          vehicleId,
        });

        const savedAssignedWork = await assignedWork.save();

        res.status(201).json(savedAssignedWork);
      }
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
