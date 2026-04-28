const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.db");

db.get("SELECT * FROM food_posts WHERE id = 8", (err, row) => {
  if (err) {
    console.error(err);
  } else {
    console.log(JSON.stringify(row, null, 2));
  }
  db.close();
});
