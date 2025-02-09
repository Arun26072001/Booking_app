const express = require("express");
const { addVehicle, getAllVehicles } = require("../controllers/vehicleController");
const { verifyAdmin } = require("../middleware/authorization");
const router = express.Router();

router.post("/", verifyAdmin, addVehicle);
router.get("/", getAllVehicles);

module.exports = router;