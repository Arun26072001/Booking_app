const express = require("express");
const { addEmployee, loginUser, logoutUser, forgetPassword, getEmployees, updateEmployee, getEmployeeData } = require("../controllers/authController");
const { verifyAdmin, verifyEmployees } = require("../middleware/authorization");
const router = express.Router();

router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.post("/", verifyAdmin, addEmployee);
router.get("/", verifyEmployees, getEmployees);
router.get("/:email", verifyEmployees, getEmployeeData);
router.post("/forget/password", forgetPassword);
router.put("/:id", verifyAdmin, updateEmployee)
module.exports = router;