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

/* ========== Existing Views ========== */
async function managementView(req, res) {
  res.render("inventory/management", { title: "Inventory Management" });
}

async function buildAddClassificationView(req, res) {
  res.render("inventory/add-classification", { title: "Add Classification" });
}

async function addClassification(req, res) {
  res.send("Classification added successfully!");
}

async function buildAddInventoryView(req, res) {
  res.render("inventory/add-inventory", { title: "Add Inventory" });
}

async function addInventory(req, res) {
  res.send("Inventory item added successfully!");
}

/* ========== Vehicle Views ========== */
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
    const data = await invModel.getInventoryById(inv_id);

    if (!data) {
      return res.status(404).render("errors/error", { message: "Vehicle not found" });
    }

    res.render("inventory/detail", {
      title: `${data.inv_make} ${data.inv_model}`,
      vehicle: data,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  buildByClassificationId,
  buildByInventoryId,
  managementView,
  buildAddClassificationView,
  addClassification,
  buildAddInventoryView,
  addInventory,
};
