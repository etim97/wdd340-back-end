const invModel = require('../models/inventoryModel'); // adjust path if needed

const Util = {};

/* ************************
 * Build dynamic navigation
/* ***************************
 * Build Navigation
 * ************************** */
Util.getNav = async function (req, res, next) {
  try {
    const data = await invModel.getClassifications();

    // Make sure we have an array of rows
    const classifications = data && data.rows ? data.rows : [];

    let list = '<ul>';
    list += '<li><a href="/" title="Home page">Home</a></li>';

    classifications.forEach((row) => {
      list += `<li><a href="/classification/${row.classification_name}" title="View ${row.classification_name} vehicles">${row.classification_name}</a></li>`;
    });

    list += '</ul>';

    // Store nav in res.locals for layout templates
    res.locals.nav = list;
    next();
  } catch (err) {
    next(err);
  }
};


/* ************************
 * Middleware for handling errors
 * ************************ */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ************************
 * Build the classification grid HTML
 * ************************ */
Util.buildClassificationGrid = async function (data) {
  let grid = "";
  if (data.length > 0) {
    grid += '<ul class="inventory-grid">';
    data.forEach((vehicle) => {
      grid += `
        <li>
          <a href="/inventory/detail/${vehicle.inv_id}">
            <img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
            <h2>${vehicle.inv_make} ${vehicle.inv_model}</h2>
            <p>Price: $${vehicle.inv_price.toLocaleString()}</p>
          </a>
        </li>
      `;
    });
    grid += "</ul>";
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* ************************
 * Build a single vehicle detail view
 * ************************ */
Util.buildVehicleDetailView = function (vehicle) {
  const priceFormatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(vehicle.inv_price);

  const mileageFormatted = new Intl.NumberFormat("en-US").format(
    vehicle.inv_miles
  );

  return `
    <section class="vehicle-detail">
      <img src="${vehicle.inv_image}" alt="${vehicle.inv_make} ${vehicle.inv_model}" />
      <h1>${vehicle.inv_make} ${vehicle.inv_model} (${vehicle.inv_year})</h1>
      <p><strong>Price:</strong> ${priceFormatted}</p>
      <p><strong>Mileage:</strong> ${mileageFormatted} miles</p>
      <p>${vehicle.inv_description}</p>
    </section>
  `;
};


async function buildClassificationList(classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (classification_id != null && row.classification_id == classification_id) {
      classificationList += ' selected '
    }
    classificationList += '>' + row.classification_name + '</option>'
  })
  classificationList += '</select>'
  return classificationList
}

/* ************************
 * Export all utils
 * ************************ */
module.exports = {
  getNav: Util.getNav,
  handleErrors: Util.handleErrors,
  buildClassificationGrid: Util.buildClassificationGrid,
  buildVehicleDetailView: Util.buildVehicleDetailView,
  buildClassificationList,
};
