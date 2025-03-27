const mongoose = require("mongoose");
const Joi = require("joi");

const vehicleSchema = mongoose.Schema({
    name: { type: String },
    perKm: { type: Number },
    perDay: { type: Number },
    capacity: { type: Number },
    vehicleNo: { type: String }
});

const Vehicle = mongoose.model("vehicle", vehicleSchema);

const vehicleValidation = Joi.object({
    _id: Joi.string().optional(),
    name: Joi.string().required().label("Vehicle Name"),
    perKm: Joi.number().positive().required().label("Price Per Kilometer"),
    perDay: Joi.number().positive().required().label("Price Per Day"),
    capacity: Joi.number().integer().positive().required().label("Capacity"),
    vehicleNo: Joi.string().required().label("Vehicle Number"),
    __v: Joi.number().optional()
});

module.exports = { Vehicle, vehicleValidation }