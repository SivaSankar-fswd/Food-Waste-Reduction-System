const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Create a new pool using the connection string from environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes("localhost") 
    ? false 
    : { rejectUnauthorized: false }
});

// Helper function to convert SQLite style '?' placeholders to PostgreSQL style '$1', '$2', etc.
function convertSql(sql) {
  let count = 1;
  return sql.replace(/\?/g, () => `$${count++}`);
}

/**
 * Compatibility layer to mimic the sqlite3 API
 */
const db = {
  run: function (sql, params, callback) {
    const pgSql = convertSql(sql);
    pool.query(pgSql, params, (err, res) => {
      // Mocking the 'this' context for sqlite3 if needed (e.g., lastID, changes)
      const context = {
        lastID: null, // PostgreSQL doesn't provide lastID easily without RETURNING clause
        changes: res ? res.rowCount : 0
      };
      if (callback) callback.call(context, err);
    });
  },
  get: function (sql, params, callback) {
    const pgSql = convertSql(sql);
    pool.query(pgSql, params, (err, res) => {
      if (callback) callback(err, res && res.rows.length > 0 ? res.rows[0] : null);
    });
  },
  all: function (sql, params, callback) {
    const pgSql = convertSql(sql);
    pool.query(pgSql, params, (err, res) => {
      if (callback) callback(err, res ? res.rows : []);
    });
  }
};

/**
 * Initialize the PostgreSQL database schema
 */
const initDb = async () => {
  try {
    // Users table
    await pool.query(`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT,
      contact TEXT,
      location TEXT,
      photo TEXT
    )`);

    // Food posts table
    await pool.query(`CREATE TABLE IF NOT EXISTS food_posts (
      id SERIAL PRIMARY KEY,
      donor_id INTEGER,
      food_name TEXT,
      quantity TEXT,
      location TEXT,
      contact TEXT,
      status TEXT DEFAULT 'available',
      receiver_name TEXT,
      receiver_contact TEXT,
      receiver_location TEXT,
      receiver_id INTEGER,
      expiry_date TEXT,
      posted_date TEXT,
      accepted_date TEXT,
      latitude DOUBLE PRECISION,
      longitude DOUBLE PRECISION,
      photo TEXT
    )`);
    await pool.query(`ALTER TABLE food_posts ADD COLUMN IF NOT EXISTS photo TEXT`);

    // Insert default admin user if not exists
    const adminCheck = await pool.query("SELECT * FROM users WHERE email = $1", ["admin@foodwaste.com"]);
    if (adminCheck.rows.length === 0) {
      const hashedPassword = bcrypt.hashSync("admin123", 8);
      await pool.query(
        "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
        ["Admin User", "admin@foodwaste.com", hashedPassword, "admin"]
      );
      console.log("Default admin user created: admin@foodwaste.com / admin123");
    }
    
    console.log("PostgreSQL Database initialized successfully");
  } catch (err) {
    console.error("PostgreSQL Initialization Error:", err);
  }
};

// Run initialization
initDb();

module.exports = { ...db, pool };
