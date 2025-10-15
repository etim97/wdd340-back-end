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

/// Management view
async function managementView(req, res) {
  const message = req.flash('message'); // Get flash messages, if any
  res.render("inventory/management", { 
    title: "Inventory Management",
    message
  });
}


// Build Add Classification View
async function buildAddClassificationView(req, res) {
  const message = req.flash('message');
  res.render("inventory/add-classification", { 
    title: "Add Classification",
    message
  });
}
async function addClassification(req, res) {
  try {
    // Extract the classification name from the form
    const { classification_name } = req.body;

    // Insert into database via model
    const result = await invModel.addClassification(classification_name);

    if (result.rowCount === 1) {
      // Set success flash message
      req.flash('message', `Classification "${classification_name}" added successfully!`);
      // Redirect to management view
      return res.redirect('/inv');
    } else {
      req.flash('message', 'Failed to add classification. Please try again.');
      return res.redirect('/inv/add-classification');
    }
  } catch (error) {
    console.error('Error adding classification:', error);
    res.status(500).render('errors/error', { message: 'Error adding classification' });
  }
}



async function buildAddInventoryView(req, res) {
  try {
    // Get all classifications
    const classifications = await invModel.getClassifications();

    // Build the HTML for the dropdown
    let classificationList = '<select name="classification_id" id="classificationList" required>';
    classifications.forEach(c => {
      classificationList += `<option value="${c.classification_id}">${c.classification_name}</option>`;
    });
    classificationList += '</select>';
    // Render the view and pass the classifications
    res.render("inventory/add-inventory", { 
      title: "Add Inventory",
      classifications
    });
  } catch (error) {
    console.error("Error fetching classifications:", error);
    res.status(500).render("errors/error", { message: "Error loading Add Inventory form" });
  }
}

async function addInventory(req, res) {
  try {
    const { inv_make, inv_model, inv_description, inv_price, classification_id } = req.body;

    const result = await invModel.addInventory({
      inv_make,
      inv_model,
      inv_description,
      inv_price,
      classification_id,
    });

    if (result.rowCount === 1) {
      req.flash('message', `Inventory item "${inv_make} ${inv_model}" added successfully!`);
      return res.redirect('/inv');
    } else {
      req.flash('message', 'Failed to add inventory item. Please try again.');
      return res.redirect('/inv/add-inventory');
    }
  } catch (error) {
    console.error('Error adding inventory item:', error);
    res.status(500).render('errors/error', { message: 'Error adding inventory item' });
  }
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
