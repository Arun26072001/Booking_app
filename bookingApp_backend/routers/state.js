const express = require("express");
const { getStates, addState } = require("../controllers/stateController");
const router = express.Router();

router.get("/", getStates);
router.post("/", addState);

module.exports = router;