const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");
const inventoryValidate = require('../middleware/inventoryValidate')

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

// Management view (task 1)
router.get('/', invController.managementView)

// Add classification view (task 2)
router.get('/add-classification', invController.buildAddClassificationView)
router.post(
  '/add-classification',
  inventoryValidate.classificationRules(),     
  inventoryValidate.checkClassificationData,   
  invController.addClassification
)

// Add inventory view (task 3)
router.get('/add-inventory', invController.buildAddInventoryView)
router.post(
  '/add-inventory',
  inventoryValidate.inventoryRules(),         
  inventoryValidate.checkInventoryData,        
  invController.addInventory
)



// Error handling middleware (apply to this router)
module.exports = router