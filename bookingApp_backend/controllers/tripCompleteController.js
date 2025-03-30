const { Booking } = require("../models/BookingModel");
const { TripComplete, TripCompleteValidation } = require("../models/TripCompleteModel")


const completeTripToDriver = async (req, res) => {
    try {
        const { id } = req.params; // Extract the booking ID from params
        const { tripDoc, startingKm, closingKm, receivedAmount } = req.body;

        // Validate booking existence
        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).send({ error: "Booking not found!" });
        }

        // Check if a TripComplete document already exists for this booking
        const existingTrip = await TripComplete.findOne({ bookingId: id });

        if (existingTrip) {
            // Limit tripDoc array size to 3
            if (existingTrip.tripDoc && existingTrip.tripDoc.length >= 3) {
                return res.status(400).send({ error: "Trip already updated with maximum documents!" });
            }

            // Update existing TripComplete document
            if (tripDoc) {
                existingTrip.tripDoc.push(...tripDoc);
            }
            existingTrip.startingKm = startingKm || existingTrip.startingKm || 0;
            existingTrip.closingKm = closingKm || existingTrip.closingKm || 0;
            existingTrip.receivedAmount = receivedAmount || existingTrip.receivedAmount || 0;

            await existingTrip.save();

            // Update booking details
            if (![0, undefined, ""].includes(startingKm) && ![0, undefined, ""].includes(closingKm)) {
                // console.log(startingKm, closingKm);

                booking.tripCompleted = true;
                await booking.save();
            }

            return res.send({
                message: `${existingTrip.startingKm} - ${existingTrip.closingKm} trip has been updated successfully!`,
                existingTrip
            });
        } else {

            // Create a new TripComplete document
            const newTripComplete = await TripComplete.create({
                bookingId: id,
                tripDoc: tripDoc ? tripDoc : [],
                startingKm: startingKm || 0,
                closingKm: closingKm || 0,
                receivedAmount: receivedAmount || 0,
            });

            booking.vehicleInTrip = newTripComplete._id;
            await booking.save();

            return res.status(201).send({ message: "Trip completed and image uploaded successfully!", newTripComplete });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: error.message });
    }
};

const getCompletedTripDetails = async (req, res) => {
    try {
        let completedTrip = await TripComplete.findOne({ bookingId: req.params.id }).exec();
        if (completedTrip?._id) {
            completedTrip = {
                ...completedTrip.toObject(),
                tripDoc: completedTrip.tripDoc.filter((file) => file !== "")
            }
            res.send(completedTrip)
        } else {
            res.status(404).send({ error: "Starting and closing Km not updated in this booking!" })
        }
    } catch (error) {
        console.log(error);

        res.status(500).send({ error: error.message })
    }
}

const updateCompletedTrip = async (req, res) => {
    try {
        // const validation = TripCompleteValidation.validate(req.body);
        // const { error } = validation;
        // if (error) {
        //     return res.status(400).send({ error: error.details[0].message })
        // } else {
        const tripCompleteData = await TripComplete.findOne({ bookingId: req.params.id });
        if (!tripCompleteData) {
            return res.status(404).send({ error: "TripCompleted data not found" })
        }
        const updateTrip = await TripComplete.findOneAndUpdate({ bookingId: req.params.id }, req.body, { new: true });
        res.send({ message: `Taxi ran in ${updateTrip.startingKm} - ${updateTrip.closingKm} with trip has been completed` })
        // }
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}

module.exports = { completeTripToDriver, getCompletedTripDetails, updateCompletedTrip }