const invModel = require("../models/invModel")
const utilities = require("../utilities/")

/* Deliver vehicle detail view */
async function buildDetailView(req, res, next) {
  try {
    const inv_id = req.params.inv_id
    const data = await invModel.getVehicleById(inv_id)

    if (!data) {
      return res.status(404).render("errors/error", { message: "Vehicle not found" })
    }

    const detailHTML = utilities.buildDetailHTML(data)
    res.render("inventory/detail", {
      title: `${data.inv_make} ${data.inv_model}`,
      detailHTML,
    })
  } catch (err) {
    next(err)
  }
}

module.exports = { buildDetailView }
