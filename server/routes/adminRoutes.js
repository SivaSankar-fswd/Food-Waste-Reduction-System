const express = require("express");
const router = express.Router();
const db = require("../db");
const { 
  getDashboardStats, 
  getAllUsers, 
  deleteUser, 
  getAllPosts, 
  deletePost 
} = require("../controllers/adminController");

router.get("/stats", getDashboardStats);
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.get("/posts", getAllPosts);
router.delete("/posts/:id", deletePost);

router.get("/monthly-posts", (req, res) => {

  db.all(
    `SELECT 
      to_char(posted_date::timestamp, 'MM') as month,
      COUNT(*) as posts
     FROM food_posts
     GROUP BY month
     ORDER BY month`,
    [],
    (err, rows) => {

      if (err) return res.status(500).json(err);

      const months = [
        "Jan","Feb","Mar","Apr","May","Jun",
        "Jul","Aug","Sep","Oct","Nov","Dec"
      ];

      const formatted = rows.map(row => ({
        month: months[parseInt(row.month) - 1],
        posts: row.posts
      }));

      res.json(formatted);
    }
  );

});

module.exports = router;
