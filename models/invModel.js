const pool = require("../database/pool")

async function getVehicleById(inv_id) {
  try {
    const result = await pool.query(
      `SELECT * FROM inventory WHERE inv_id = $1`,
      [inv_id]
    )
    return result.rows[0]
  } catch (error) {
    console.error("Database error:", error)
    throw error
  }
}

module.exports = { getVehicleById }
