const mongoose = require("mongoose");
const Joi = require("joi");

const empSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String },
    contact: { type: String },
    work: { type: String },
    account: { type: Number }
})

const Employee = mongoose.model("employee", empSchema);

const empValidation = Joi.object({
    name: Joi.string().trim().required().label("Name"),
    email: Joi.string().trim().required().label("Email Address"),
    password: Joi.string().min(4).required().label("Password"),
    contact: Joi.string().regex(/^[0-9]{10}$/).messages({ 'string.pattern.base': `Contact must have 10 digits.` }).required().label("Contact Number"),
    work: Joi.string().required().label("Work Position"),
    account: Joi.number().integer().required().label("Account Number")
});


module.exports = { Employee, empValidation }