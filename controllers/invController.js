const invModel = require("../models/inventoryModel");
const utilities = require("../utilities/");

/* Deliver inventory by classification view */
async function buildByClassificationId(req, res, next) {
  try {
    const classificationId = req.params.classificationId;
    const vehicles = await invModel.getInventoryByClassificationId(classificationId);

    if (!vehicles || vehicles.length === 0) {
      return res.status(404).render("errors/error", { message: "No vehicles found for this classification" });
    }

    res.render("inventory/classification", {
      title: "Vehicles",
      vehicles,
    });
  } catch (err) {
    next(err);
  }
}

async function buildByInventoryId(req, res, next) {
  try {
    const inv_id = req.params.invId;
    console.log("🔍 Vehicle ID from route:", inv_id);

    const data = await invModel.getInventoryById(inv_id);
    console.log("📦 Data returned from DB:", data);

    if (!data) {
      console.log("❌ No vehicle found for ID:", inv_id);
      return res.status(404).render("errors/error", { message: "Vehicle not found" });
    }

    res.render("inventory/detail", {
      title: `${data.inv_make} ${data.inv_model}`,
      vehicle: data
    });
  } catch (err) {
    console.error("💥 Error in buildByInventoryId:", err);
    next(err);
  }
}


module.exports = { buildByClassificationId, buildByInventoryId };