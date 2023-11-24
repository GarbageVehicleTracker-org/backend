// assignedWorkSchema.js
const mongoose = require("mongoose");
const Area = require("./AreaSchema"); // Import the Area schema
const Driver = require("./DriverSchema"); // Import the Driver schema
const Vehicle = require("./VehicleSchema");

const assignedWorkSchema = new mongoose.Schema({
    areaId: {
        type: String,
        required: true,
        validate: {
            validator: async function (value) {
                return await Area.findOne({ areaId: value }) !== null;
            },
            message: "Area not found",
        },
    },
    
    driverId: {
        type: String,
        required: true,
        validate: {
            validator: async function (value) {
                return await Driver.findOne({ driverId: value }) !== null;
            },
            message: "Driver not found",
        },
    },
    vehicleId: {
        type: String,
        required: true,
        validate: {
            validator: async function (value) {
                return await Vehicle.findOne({ id: value }) !== null;
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
