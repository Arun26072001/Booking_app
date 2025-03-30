const express = require("express");
const { addAllotment, getAllotments, getAllomentById, updateAllotment } = require("../controllers/AllotmentController");
const { verifyAdmin, verifyAdminAllotor, verifyEmployees } = require("../middleware/authorization");
const router = express.Router();

// router.get("/driver-trips", getDriverTrips);
router.post("/:id", verifyAdminAllotor, addAllotment);
router.get("/", verifyEmployees, getAllotments);
router.get("/:id", verifyAdminAllotor, getAllomentById);
router.put("/:id", verifyAdmin, updateAllotment)

module.exports = router;