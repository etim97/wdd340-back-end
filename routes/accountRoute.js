const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/");
const verifyToken = require("../middleware/verifyToken");
// Login & Register
router.get("/login", accountController.buildLogin)
router.post("/login", accountController.loginClient)
router.get("/register", accountController.buildRegister)
router.post("/register", accountController.registerClient)
router.get("/management", verifyToken, accountController.buildAccountManagement);

router.get("/management", verifyToken, accountController.buildAccountManagement);


// Logout
router.get("/logout", accountController.logoutClient)
// ✅ Protected route
router.get("/management", verifyToken, accountController.buildAccountManagement);
router.get("/update/:id", utilities.checkLogin, accountController.buildUpdateAccountView)
router.post("/update", utilities.checkLogin, accountController.updateAccountInfo)
module.exports = router
