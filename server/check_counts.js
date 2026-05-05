const { pool } = require("./db");

async function checkCounts() {
  try {
    const userCount = await pool.query("SELECT COUNT(*) AS total FROM users");
    const postCount = await pool.query("SELECT COUNT(*) AS total FROM food_posts");
    console.log("Database Statistics:");
    console.log("Total Users:", userCount.rows[0].total);
    console.log("Total Posts:", postCount.rows[0].total);
    process.exit(0);
  } catch (err) {
    console.error("Database Error:", err);
    process.exit(1);
  }
}

checkCounts();
