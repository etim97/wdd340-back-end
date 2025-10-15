const db = require("../database/");

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  try {
    const data = await db.query(
      "SELECT * FROM public.classification ORDER BY classification_name"
    );
    return data.rows; // return only the rows
  } catch (error) {
    console.error("getClassifications error: " + error);
    return [];
  }
} 

/* ***************************
 * Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await db.query(
      `SELECT * FROM public.inventory AS i
      JOIN public.classification AS c
      ON i.classification_id = c.classification_id
      WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getclassificationsbyid error " + error);
    return [];
  }
}

async function getInventoryById(inv_id) {
  try {
    const result = await db.query(
      `SELECT * FROM public.inventory AS i
       JOIN public.classification AS c
       ON i.classification_id = c.classification_id
       WHERE inv_id = $1`,
      [inv_id]
    );
    return result.rows[0]; // ✅ Return the first (and only) matching vehicle
  } catch (error) {
    console.error("Error fetching vehicle by inv_id:", error);
  }
}



/* ***************************
 *  Add New Classification
 * ************************** */
async function addNewClassification(classification_name) {
    try {
        const sql = `
            INSERT INTO public.classification (classification_name)
            VALUES ($1)
            RETURNING *`;
        return await db.query(sql, [classification_name]);
    } catch (error) {
        console.error("addClassification error: " + error);
        return error;
    }
}

/* ***************************
 *  Add New Inventory Item
 * ************************** */
async function addInventory(invData) {
    try {
        const sql = `
            INSERT INTO public.inventory (
                classification_id,
                inv_make,
                inv_model,
                inv_description,
                inv_image,
                inv_thumbnail,
                inv_price,
                inv_year,
                inv_miles,
                inv_color
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *`;

        const data = await db.query(sql, [
            invData.classification_id,
            invData.inv_make,
            invData.inv_model,
            invData.inv_description,
            invData.inv_image,
            invData.inv_thumbnail,
            invData.inv_price,
            invData.inv_year,
            invData.inv_miles,
            invData.inv_color,
        ]);

        return data;
    } catch (error) {
        console.error("addInventory model error: " + error);
        return null;
    }
}

/* ***************************
 *  Update Inventory Item
 * ************************** */
async function updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
) {
    try {
        const sql = `
            UPDATE public.inventory 
            SET 
                inv_make = $1, 
                inv_model = $2, 
                inv_description = $3, 
                inv_image = $4, 
                inv_thumbnail = $5, 
                inv_price = $6, 
                inv_year = $7, 
                inv_miles = $8, 
                inv_color = $9, 
                classification_id = $10 
            WHERE inv_id = $11 
            RETURNING *`;

        const data = await db.query(sql, [
            inv_make,
            inv_model,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_year,
            inv_miles,
            inv_color,
            classification_id,
            inv_id,
        ]);

        console.log(data.rows[0]);
        return data.rows[0];
    } catch (error) {
        console.error("updateInventory model error: " + error);
    }
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */
async function deleteInventory(inv_id) {
    try {
        const sql = 'DELETE FROM public.inventory WHERE inv_id = $1';
        const data = await db.query(sql, [inv_id]);
        return data;
    } catch (error) {
        console.error('Delete Inventory Error: ' + error);
    }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryById, // ✅ make sure this line exists
  addNewClassification,
  addInventory,
  updateInventory,
  deleteInventory
};
