const express = require("express")
const router = express.Router()
const invController = require("../controllers/invController")

// Detail route
router.get("/detail/:inv_id", invController.buildDetailView)

module.exports = router
