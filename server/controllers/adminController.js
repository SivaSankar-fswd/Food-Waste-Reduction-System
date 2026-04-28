const db = require("../db");

exports.getDashboardStats = (req, res) => {
  const stats = {};

  db.get("SELECT COUNT(*) AS totalUsers FROM users", [], (err, row) => {
    stats.totalUsers = row.totalUsers;

    db.get("SELECT COUNT(*) AS totalPosts FROM food_posts", [], (err, row) => {
      stats.totalPosts = row.totalPosts;

      db.get("SELECT COUNT(*) AS accepted FROM food_posts WHERE status='accepted'", [], (err, row) => {
        stats.accepted = row.accepted;

        db.get("SELECT COUNT(*) AS available FROM food_posts WHERE status='available'", [], (err, row) => {
          stats.available = row.available;

          res.json(stats);
        });
      });
    });
  });
};


