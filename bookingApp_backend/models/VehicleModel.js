const mongoose = require("mongoose");
const Joi = require("joi");

const vehicleSchema = mongoose.Schema({
    name: { type: String },
    perKm: { type: Number },
    perDay: { type: Number },
    capacity: { type: Number },
    type: { type: String },
    vehicleModel: { type: String },
    FCExpireDate: {type: Date},
    insuranceExpireDate: {type: Date},
    vehicleNo: { type: String }
});

const Vehicle = mongoose.model("vehicle", vehicleSchema);

const vehicleValidation = Joi.object({
    _id: Joi.string().optional(),
    __v: Joi.number().optional(),
    name: Joi.string().required().label("Vehicle Name"),
    perKm: Joi.number().positive().required().label("Price Per Kilometer"),
    perDay: Joi.number().positive().required().label("Price Per Day"),
    capacity: Joi.number().integer().positive().required().label("Capacity"),
    type: Joi.string().required().label("vehicle type"),
    FCExpireDate: Joi.string().required().label("FC expire Date"),
    insuranceExpireDate: Joi.string().required().label("InsuranceExpireDate"),
    vehicleModel: Joi.string().required().label("vehicle Model"),
    vehicleNo: Joi.string().required().label("Vehicle Number"),
});

module.exports = { Vehicle, vehicleValidation }