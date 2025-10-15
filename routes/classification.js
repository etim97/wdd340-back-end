const express = require("express");
const router = express.Router();
const inventoryModel = require("../models/inventoryModel");

// Route for vehicle classifications (e.g., /classification/sedan)
router.get("/:type", async (req, res) => {
  const type = req.params.type;
  try {
    // Get classification id from name
    const classifications = await inventoryModel.getClassifications(); // already an array

    console.log("Classifications:", classifications);

    const classification = classifications.find(
      c => c.classification_name.toLowerCase() === type.toLowerCase()
    );

    if (!classification) {
      return res.status(404).render("errors/error", {
        title: "404 - Page Not Found",
        message: "Sorry, this classification does not exist.",
        nav: res.locals.nav,
      });
    }

    // Get vehicles by classification id
    const vehicles = await inventoryModel.getInventoryByClassificationId(classification.classification_id);

    res.render("inventory/classification", {
      title: type.charAt(0).toUpperCase() + type.slice(1),
      vehicles
    });
  } catch (error) {
    console.log(error);
    res.status(500).render("errors/error", {
      title: "Server Error",
      message: "Something went wrong on our side.",
      nav: res.locals.nav,
    });
  }
});

// Route for vehicle detail page (e.g., /classification/detail/1)
router.get("/detail/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const vehicle = await inventoryModel.getVehicleDetails(id);
    if (!vehicle) {
      return res.status(404).render("errors/error", {
        title: "404 - Page Not Found",
        message: "Sorry, this vehicle does not exist.",
        nav: res.locals.nav,
      });
    }
    res.render("inventory/vehicle-detail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      vehicle
    });
  } catch (error) {
    res.status(500).render("errors/error", {
      title: "Server Error",
      message: "Something went wrong on our side.",
      nav: res.locals.nav,
    });
  }
});

module.exports = router;