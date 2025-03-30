const express = require("express");
const { addBooking, getBookingById, getAllBookings, deleteBooking, getCustomers, getDriverBookings, getAllotorTrips, updateBooking, getBookingByMail } = require("../controllers/bookingController");
const { verifyAdmin, verifyAllotor, verifyAdminBooker, verifyEmployees, verifyDriverAllotorAdmin } = require("../middleware/authorization");
const router = express.Router();

router.get("/customers", verifyEmployees, getCustomers);
router.get("/customer/:mail", verifyAdmin, getBookingByMail);
// getting driver trips
router.get("/driver-booking/:id", verifyDriverAllotorAdmin, getDriverBookings);
// get alloter trips
router.get("/allotor-booking/:id", verifyAllotor, getAllotorTrips);
router.post("/:id", verifyAdminBooker, addBooking);
router.get("/:id", verifyEmployees, getBookingById);
router.get("/", verifyEmployees, getAllBookings);
router.put("/:id", verifyAdminBooker, updateBooking);
router.delete("/:id", verifyAdmin, deleteBooking);

module.exports = router;