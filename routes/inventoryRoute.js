 const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Detail route
router.get("/detail/:invId", invController.buildByInventoryId);

// Intentional error route for testing
router.get("/test/error", (req, res, next) => {
  const err = new Error("Intentional test error");
  err.status = 500;
  next(err);
});

module.exports = router;