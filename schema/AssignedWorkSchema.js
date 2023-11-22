// assignedWorkSchema.js
const mongoose = require("mongoose");

const assignedWorkSchema = new mongoose.Schema({
    areaId: {
        type: String,
        required: true,
    },
    driverId: {
        type: String,
        required: true,
    },
    vehicleId: {
        type: String,
        required: true,
    },
    assignedAt: {
        type: Date,
        default: Date.now,
    },
});

const AssignedWork = mongoose.model("AssignedWork", assignedWorkSchema);

module.exports = AssignedWork;
