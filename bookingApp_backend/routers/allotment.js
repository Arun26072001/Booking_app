const express = require("express");
const { addAllotment, getAllotments, getAllomentById, updateAllotment } = require("../controllers/AllotmentController");
const { verifyAdmin } = require("../middleware/authorization");
const router = express.Router();

// router.get("/driver-trips", getDriverTrips);
router.post("/:id", addAllotment);
router.get("/", getAllotments);
router.get("/:id", getAllomentById);
router.put("/:id", verifyAdmin, updateAllotment)

module.exports = router;