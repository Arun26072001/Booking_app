const mongoose = require("mongoose");
const Joi = require("joi");

const tripCompleteSchema = new mongoose.Schema(
    {
        bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "booking" },
        startingKm: { type: Number },
        closingKm: { type: Number },
        receivedAmount: { type: Number },
        tripDoc: [{ type: String }], // Array of strings
    },
    { timestamps: true }
);


const TripComplete = mongoose.model('tripComplete', tripCompleteSchema)

const TripCompleteValidation = Joi.object({
    bookingId: Joi.string().hex().length(24).required(), // Valid MongoDB ObjectId
    startingKm: Joi.number().positive().required(),
    closingKm: Joi.number().positive().min(Joi.ref('startingKm')).required(), // closingKm should be >= startingKm
    receivedAmount: Joi.number().positive().required(),
    tripDoc: Joi.array().items(Joi.string().required()).min(1).required()
});

module.exports = { TripComplete, TripCompleteValidation }