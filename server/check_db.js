const db = require("./db");

db.get("SELECT * FROM food_posts WHERE id = 8", [], (err, row) => {
  if (err) {
    console.error(err);
  } else {
    console.log(JSON.stringify(row, null, 2));
  }
  // No need to close explicitly if using the shared pool in db.js for a simple script
  process.exit(0);
});
