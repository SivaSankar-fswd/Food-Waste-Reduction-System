const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");

const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.log("DB Connection Error:", err);
  } else {
    console.log("Connected to database.db");
  }
});

// Users table
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT UNIQUE,
  password TEXT,
  role TEXT,
  contact TEXT,
  location TEXT,
  photo TEXT
)`);

// Add photo column to existing users table if not present
db.run("ALTER TABLE users ADD COLUMN photo TEXT", (err) => {
  // This may fail if column already exists; ignore that error.
});

// Food posts table
db.run(`CREATE TABLE IF NOT EXISTS food_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  donor_id INTEGER,
  food_name TEXT,
  quantity TEXT,
  location TEXT,
  contact TEXT,
  status TEXT DEFAULT 'available',
  receiver_name TEXT,
  receiver_contact TEXT,
  receiver_location TEXT
)`);
db.run(`ALTER TABLE food_posts ADD COLUMN receiver_id INTEGER`, ()=>{});
db.run(`ALTER TABLE food_posts ADD COLUMN expiry_date TEXT`, ()=>{});
db.run(`ALTER TABLE food_posts ADD COLUMN posted_date TEXT`, ()=>{});
db.run(`ALTER TABLE food_posts ADD COLUMN accepted_date TEXT`, ()=>{});
db.run(`ALTER TABLE food_posts ADD COLUMN latitude REAL`, ()=>{});
db.run(`ALTER TABLE food_posts ADD COLUMN longitude REAL`, ()=>{});

// Insert default admin user if not exists
db.get("SELECT * FROM users WHERE email = ?", ["admin@foodwaste.com"], (err, row) => {
  if (!row) {
    const hashedPassword = bcrypt.hashSync("admin123", 8);
    db.run("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", 
      ["Admin User", "admin@foodwaste.com", hashedPassword, "admin"], 
      (err) => {
        if (err) {
          console.log("Error inserting admin user:", err);
        } else {
          console.log("Default admin user created: admin@foodwaste.com / admin123");
        }
      }
    );
  }
});

module.exports = db;
