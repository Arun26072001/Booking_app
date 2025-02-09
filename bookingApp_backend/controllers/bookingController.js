const { Allotment, allotmentValidation } = require("../models/AllotmentModel");
const { Booking, bookingValidation } = require("../models/BookingModel");
const { TripComplete, TripCompleteValidation } = require("../models/TripCompleteModel");
const { ObjectId } = require("mongoose").Types;

async function addBooking(req, res) {
    try {
        const { email, customerContact } = req.body;
        const newBooking = {
            ...req.body,
            bookingOfficer: req.params.id
        }
        const { error } = bookingValidation.validate(newBooking);
        if (error) {
            res.status(403).send({ error: error.message.replace(/["\\]/g, '') })
        } else {
            const isEmail = await Booking.find({ email }).exec();
            const isContact = await Booking.find({ customerContact }).exec();
            if (isEmail.length > 0) {
                res.status(400).send({ error: "Already has the Customer in this mail!" })
            } else if (isContact > 0) {
                res.status(400).send({ error: "Already has the Customer in this Contact Number!" })
            } else {
                const booking = await Booking.create(newBooking);
                res.send({ message: `${booking.pickupLocation} - ${booking.destination} Booking has been saved successfully!` })
            }
        }
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
}

async function getBookingById(req, res) {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate("vehicleType")
            .populate({
                path: "allotment",
                // populate: [
                //     {
                //         path: "allotmentOfficer",
                //         select: "name"
                //     },
                //     {
                //         path: "driver",
                //         select: "name"
                //     }

                // ]
            })
            .populate({ path: "vehicleInTrip" })
        if (!booking) {
            res.status(404).send({ error: "Wrong Booking Id" })
        } else {
            res.send(booking)
        }
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}

async function getAllBookings(req, res) {
    try {
        let bookings = await Booking.find({}).populate({
            path: "allotment",
            populate: [{
                path: "vehicle"
            }]
        }).populate({ path: "vehicleType" });
        bookings = bookings.sort((a, b) => b.pickupDateTime - a.pickupDateTime)
        res.send(bookings);
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}

async function deleteBooking(req, res) {
    try {
        const booking = await Booking.findById({ _id: req.params.id });
        const { tripCompleted } = booking;
        if (tripCompleted) {
            return res.status(400).send({ error: "You can't delete this booking, Because it's completed." })
        } else {
            const deleteIt = await Booking.findByIdAndDelete({ _id: req.params.id })
            return res.send({ message: "Booking has been delete successfully" })
        }
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}

async function getCustomers(req, res) {
    try {
        const cus = await Booking.find({}, "customerContact customerName email pickupLocation destination tripType")
            .populate("vehicleType")
            .populate("allotment")
            .populate("vehicleInTrip")
            .exec();
        if (cus.length > 0) {
            return res.send({
                customers: cus
            })
        } else {
            return res.status(404).send({ error: "Customers data not found in bookings" })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: error.message })
    }
}

async function getBookingByMail(req, res) {
    try {
        const booking = await Booking.findOne({ email: req.params.mail }, "customerContact customerName email pickupLocation destination tripType")
            .populate({ path: "vehicleType", select: "name" })
            .populate({
                path: "allotment",
                populate: [
                    { path: "allotmentOfficer", select: "name" },
                    { path: "driver", select: "name contact" }
                ]
            })
            .populate("vehicleInTrip")
            .exec();
        if (booking._id) {
            return res.send(booking)
        } else {
            return res.status(404).send({ error: "No Booking data in this customer mail" })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: error.message })
    }
}

async function getDriverBookings(req, res) {
    try {
        // Fetch all bookings for the driver
        let driverTrips = await Booking.find()
            .populate({
                path: "allotment"
            })
            .populate("vehicleType") // Populate vehicleType
            .exec();

        driverTrips = driverTrips.filter((trip) => {
            const driverId = trip.allotment?.driver;
            const paramId = req.params.id;
            return driverId && new ObjectId(driverId).equals(paramId);
        })

        // Filter and sort trips if there are any
        if (driverTrips.length > 0) {
            const sortedTrips = driverTrips
                .filter(trip => trip.pickupDateTime) // Ensure pickupDateTime exists
                .sort((a, b) => new Date(b.pickupDateTime) - new Date(a.pickupDateTime)); // Sort by pickupDateTime (latest first)

            return res.status(200).send(sortedTrips);
        } else {
            return res.status(404).send({ error: "Sorry, no trips assigned for you!" });
        }
    } catch (error) {
        console.error("Error fetching driver bookings:", error); // Log error for debugging
        res.status(500).send({ error: error.message });
    }
}

async function getAllotorTrips(req, res) {
    try {
        let driverTrips = await Booking.find()
            .populate({
                path: "allotment",
                match: { allotmentOfficer: { $in: req.params.id } }
            })
            .populate({ path: "vehicleType" })
            .exec();
        if (driverTrips.length > 0) {
            driverTrips = driverTrips.sort((a, b) => b.pickupDateTime - a.pickupDateTime)
            return res.send(driverTrips);
        } else {
            return res.status(404).send({ error: "Sorry, No Trips assign for you!" })
        }
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}

async function updateBooking(req, res) {
    try {
        let { allotment, vehicleInTrip } = req.body;
        allotment = {
            bookingId: allotment.bookingId,
            allotmentOfficer: allotment.allotmentOfficer,
            driver: allotment.driver,
            vehicle: allotment.vehicle
        }
        vehicleInTrip = {
            bookingId: vehicleInTrip.bookingId,
            startingKm: vehicleInTrip.startingKm,
            closingKm: vehicleInTrip.closingKm,
            receivedAmount: vehicleInTrip.receivedAmount,
            tripDoc: vehicleInTrip.tripDoc
        }

        // Validate Allotment Data
        const { error: allotmentError } = allotmentValidation.validate(allotment);
        if (allotmentError) {
            return res.status(400).send({ error: allotmentError.details[0].message });
        }

        // Validate TripComplete Data
        const { error: tripCompleteError } = TripCompleteValidation.validate(vehicleInTrip);
        if (tripCompleteError) {
            return res.status(400).send({ error: tripCompleteError.details[0].message });
        }

        // Update Allotment
        if (!allotment._id) {
            return res.status(400).send({ error: "Allotment ID is required for updating." });
        }
        const updatedAllotment = await Allotment.findByIdAndUpdate(
            allotment._id,
            allotment,
            { new: true }
        );

        // Update TripComplete
        if (!vehicleInTrip._id) {
            return res.status(400).send({ error: "TripComplete ID is required for updating." });
        }
        const updatedTripComplete = await TripComplete.findByIdAndUpdate(
            vehicleInTrip._id,
            vehicleInTrip,
            { new: true }
        );

        // Update Booking
        const updatedBooking = await Booking.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        // Check if booking was updated
        if (!updatedBooking) {
            return res.status(404).send({ error: "No booking data found!" });
        }

        // Success Response
        return res.send({
            message: "Booking data has been updated.",
            updatedBooking,
            updatedAllotment,
            updatedTripComplete,
        });

    } catch (error) {
        console.error("Error updating booking:", error);
        return res.status(500).send({ error: error.message });
    }
}

module.exports = { addBooking, getBookingById, getBookingByMail, getAllBookings, deleteBooking, getCustomers, getDriverBookings, getAllotorTrips, updateBooking }