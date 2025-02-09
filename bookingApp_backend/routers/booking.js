const express = require("express");
const { addBooking, getBookingById, getAllBookings, deleteBooking, getCustomers, getDriverBookings, getAllotorTrips, updateBooking, getBookingByMail } = require("../controllers/bookingController");
const { verifyAdmin, verifyAllotor, verifyAdminBooker } = require("../middleware/authorization");
const router = express.Router();

router.get("/customers", getCustomers);
router.get("/customer/:mail", getBookingByMail);
// getting driver trips
router.get("/driver-booking/:id", getDriverBookings);
// get alloter trips
router.get("/allotor-booking/:id", verifyAllotor, getAllotorTrips);
router.post("/:id", verifyAdminBooker, addBooking);
router.get("/:id", getBookingById);
router.get("/", getAllBookings);
router.put("/:id", updateBooking);
router.delete("/:id", deleteBooking);

module.exports = router;