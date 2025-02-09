const mongoose = require("mongoose");
const Joi = require("joi");

const bookingSchema = new mongoose.Schema({
    customerContact: { type: String },
    customerName: { type: String },
    pickupLocation: { type: String },
    destination: { type: String },
    tripType: { type: String }, // Fixed definition
    email: {
        type: String,
        trim: true,
        lowercase: true,
    },
    // tripPlan: { type: String },
    bookingOfficer: { type: mongoose.Schema.Types.ObjectId, ref: "employee" },
    vehicleType: { type: mongoose.Schema.Types.ObjectId, ref: "vehicle" },
    pickupDateTime: { type: String },
    dropDateTime: { type: String },
    placesToVisit: [{ type: String }],
    tripCompleted: { type: Boolean, default: false },
    totalKm: { type: Number },
    totalPayment: { type: Number },
    advancePayment: { type: Number },
    allotment: { type: mongoose.Schema.Types.ObjectId, ref: "allotment" },
    vehicleInTrip: { type: mongoose.Schema.Types.ObjectId, ref: "tripComplete" }
});

const Booking = mongoose.model("Booking", bookingSchema);

const bookingValidation = Joi.object().keys({
    customerName: Joi.string().required("Customer name is required"),
    customerContact: Joi.string().regex(/^[0-9]{10}$/).messages({ 'string.pattern.base': `Customer Contact must have 10 digits.` }).required("Customer Contact is Required"), // Numeric contact
    pickupLocation: Joi.string().required("Please enter Pickup Location"),
    destination: Joi.string().required("Please Enter Drop location"),
    email: Joi.string().email().required("Email is required"),
    tripType: Joi.string().required("Please select the trip type"),
    bookingOfficer: Joi.string().hex().length(24).required().label("Booking officer"), // ObjectId validation
    vehicleType: Joi.string().required("Vehicle Type is required"), // ObjectId validation
    pickupDateTime: Joi.date().required("Pickup date is required"),
    dropDateTime: Joi.date().min(Joi.ref('pickupDateTime'), "Please select valid date").required("drop date is required"), // dropDateTime should be after pickupDateTime
    placesToVisit: Joi.array().items(Joi.string()).allow(null, ''), // Optional
    tripCompleted: Joi.boolean(),
    totalKm: Joi.number().positive().required(),
    totalPayment: Joi.number().positive().required(),
    advancePayment: Joi.number().positive().max(Joi.ref('totalPayment')).required() // Shouldn't exceed total payment
});

module.exports = { Booking, bookingValidation }
