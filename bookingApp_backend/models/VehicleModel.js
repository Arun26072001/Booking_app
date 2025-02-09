const mongoose = require("mongoose");
const Joi = require("joi");

const vehicleSchema = mongoose.Schema({
    name: { type: String },
    perKm: { type: Number },
    perDay: { type: Number },
    capacity: { type: Number }
});

const Vehicle = mongoose.model("vehicle", vehicleSchema);

const vehicleValidation = Joi.object({
    name: Joi.string().required().label("Vehicle Type"),
    perKm: Joi.number().positive().required().label("Price Per Kilometer"),
    perDay: Joi.number().positive().required().label("Price Per Day"),
    capacity: Joi.number().integer().positive().required().label("Capacity") // Ensures it's a positive integer
});

module.exports = { Vehicle, vehicleValidation }