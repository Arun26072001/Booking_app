const express = require("express");
const { addEmployee, loginUser, logoutUser, forgetPassword, getEmployees } = require("../controllers/authController");
const { verifyAdmin } = require("../middleware/authorization");
const router = express.Router();

router.post("/", verifyAdmin, addEmployee);
router.get("/", getEmployees);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.post("/forget/password", forgetPassword);

module.exports = router;