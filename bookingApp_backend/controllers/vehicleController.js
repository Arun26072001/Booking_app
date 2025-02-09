const { vehicleValidation, Vehicle } = require("../models/VehicleModel");

async function addVehicle(req, res) {
    try {
        const validation = vehicleValidation.validate(req.body);
        const { error } = validation;
        if (error) {
            res.status(403).send({ error: error.message.replace(/["\\]/g, '') })
        } else {
            const isVehicle = await Vehicle.find({ name: req.body.name });
            if (isVehicle.length > 0) {
                res.status(400).send({ error: `Already has this ${req.body.name} taxi` })
            } else {
                const addingVehicle = await Vehicle.create(req.body);
                res.send({ message: `New ${addingVehicle.name} taxi added` })
            }
        }
    } catch (err) {
        res.status(500).send({ error: "internal server error", details: err.message })
    }
}

async function getAllVehicles(req, res) {
    try {
        const vehicles = await Vehicle.find({}, "_id name").exec();
        res.send(vehicles)
    } catch (error) {
        res.send({ error: error.message })
    }
}

module.exports = { addVehicle, getAllVehicles };