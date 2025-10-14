// middleware/inventoryValidate.js
const utilities = require("../utilities/");
const { body, validationResult } = require("express-validator");

// ✅ Classification Validation Rules
const classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .notEmpty()
      .withMessage("Please provide a classification name.")
      .isLength({ min: 2 })
      .withMessage("Classification name must be at least 2 characters long.")
  ];
};

// ✅ Inventory Validation Rules
const inventoryRules = () => {
  return [
    body("inv_make")
      .trim()
      .notEmpty()
      .withMessage("Please provide a make."),
    body("inv_model")
      .trim()
      .notEmpty()
      .withMessage("Please provide a model."),
    body("inv_year")
      .isInt({ min: 1885, max: new Date().getFullYear() + 1 })
      .withMessage("Please provide a valid year."),
    body("inv_price")
      .isFloat({ min: 0 })
      .withMessage("Please provide a valid price."),
    body("inv_miles")
      .isInt({ min: 0 })
      .withMessage("Please provide valid mileage."),
    body("inv_color")
      .trim()
      .notEmpty()
      .withMessage("Please provide a color."),
    body("classification_id")
      .notEmpty()
      .withMessage("Please choose a classification.")
  ];
};

// ✅ Check Data and Return Errors if Any
const checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    return res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: errors.array(),
      classification_name: req.body.classification_name
    });
  }
  next();
};

const checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList(req.body.classification_id);
    return res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      errors: errors.array(),
      vehicle: req.body
    });
  }
  next();
};

module.exports = {
  classificationRules,
  inventoryRules,
  checkClassificationData,
  checkInventoryData
};
