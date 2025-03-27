const express = require("express");
const { addVehicle, getAllVehicles, updateVehicle, getVehicleById } = require("../controllers/vehicleController");
const { verifyAdmin } = require("../middleware/authorization");
const router = express.Router();

router.post("/", verifyAdmin, addVehicle);
router.get("/", verifyAdmin, getAllVehicles);
router.put("/:id", verifyAdmin, updateVehicle);
router.get("/:name", verifyAdmin, getVehicleById)

module.exports = router;