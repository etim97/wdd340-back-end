const db = require("../database/");

async function register(firstname, lastname, email, hashedPassword) {
  const sql = `
    INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
    VALUES ($1, $2, $3, $4)
    RETURNING account_id
  `;
  const values = [firstname, lastname, email, hashedPassword];
  const result = await db.query(sql, values); // 
  return result.rows[0];
}


async function findByEmail(email) {
  const result = await db.query(
    "SELECT * FROM account WHERE account_email = $1",
    [email]
  );
  return result.rows[0];
}

async function getAccountById(id) {
  return (await db.query("SELECT * FROM account WHERE account_id = $1", [id])).rows[0];
}

async function updateAccountInfo(id, firstname, lastname, email) {
  return db.query(
    `UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4`,
    [firstname, lastname, email, id]
  );
}

async function updatePassword(id, hashedPassword) {
  return db.query(`UPDATE account SET account_password = $1 WHERE account_id = $2`, [
    hashedPassword,
    id,
  ]);
}

module.exports = { register, findByEmail,  getAccountById, updateAccountInfo, updatePassword };
