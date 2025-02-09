const express = require("express");
const { completeTripToDriver, getCompletedTripDetails, updateCompletedTrip } = require("../controllers/tripCompleteController");
const { verifyAdmin, verifyDriverAllotorAdmin } = require("../middleware/authorization");
// const { upload } = require("../controllers/ImgUpload");
const router = express.Router();

router.post("/:id", verifyDriverAllotorAdmin, completeTripToDriver);
router.get("/:id", getCompletedTripDetails);
router.put("/:id", verifyAdmin, updateCompletedTrip);

module.exports = router;