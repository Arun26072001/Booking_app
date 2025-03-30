const express = require("express");
const { addVehicle, getAllVehicles, updateVehicle, getVehicleById } = require("../controllers/vehicleController");
const { verifyAdmin, verifyEmployees } = require("../middleware/authorization");
const router = express.Router();

router.post("/", verifyAdmin, addVehicle);
router.get("/", verifyEmployees, getAllVehicles);
router.put("/:id", verifyAdmin, updateVehicle);
router.get("/:name", verifyEmployees, getVehicleById)

module.exports = router;