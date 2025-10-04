function buildDetailHTML(data) {
  return `
    <div class="vehicle-detail">
      <img src="${data.inv_image}" alt="${data.inv_make} ${data.inv_model}">
      <div class="vehicle-info">
        <h2>${data.inv_year} ${data.inv_make} ${data.inv_model}</h2>
        <p><strong>Price:</strong> $${data.inv_price.toLocaleString()}</p>
        <p><strong>Mileage:</strong> ${data.inv_miles.toLocaleString()} miles</p>
        <p>${data.inv_description}</p>
      </div>
    </div>
  `
}

module.exports = { buildDetailHTML }
