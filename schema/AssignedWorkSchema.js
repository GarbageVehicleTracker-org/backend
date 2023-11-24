// assignedWorkSchema.js
const mongoose = require("mongoose");

const assignedWorkSchema = new mongoose.Schema({
    areaId: {
        type: String,
        required: true,
        validate: {
            validator: async function (value) {
                const area = await Area.findOne(value);
                return area !== null;
            },
            message: "Area not found",
        },
    },
    driverId: {
        type: String,
        required: true,
        validate: {
            validator: async function (value) {
                const driver = await Driver.findOne(value);
                return driver !== null;
            },
            message: "Driver not found",
        },
    },
    vehicleId: {
        type: String,
        required: true,
        validate: {
            validator: async function (value) {
                const vehicle = await Vehicle.findOne(value);
                return vehicle !== null;
            },
            message: "Vehicle not found",
        },
    },
    assignedAt: {
        type: Date,
        default: Date.now,
    },
});

const AssignedWork = mongoose.model("AssignedWork", assignedWorkSchema);

module.exports = AssignedWork;
