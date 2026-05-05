const { pool } = require("../db");

exports.getDashboardStats = async (req, res) => {
  try {
    const userCount = await pool.query("SELECT COUNT(*) AS total FROM users");
    const postCount = await pool.query("SELECT COUNT(*) AS total FROM food_posts");
    const acceptedCount = await pool.query("SELECT COUNT(*) AS total FROM food_posts WHERE status='accepted'");
    const availableCount = await pool.query("SELECT COUNT(*) AS total FROM food_posts WHERE status='available'");

    res.json({
      totalUsers: parseInt(userCount.rows[0].total),
      totalPosts: parseInt(postCount.rows[0].total),
      accepted: parseInt(acceptedCount.rows[0].total),
      available: parseInt(availableCount.rows[0].total)
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, email, role, contact, location FROM users ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [req.params.id]);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT f.*, u.name as donor_name 
      FROM food_posts f 
      JOIN users u ON f.donor_id = u.id 
      ORDER BY f.id DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

exports.deletePost = async (req, res) => {
  try {
    await pool.query("DELETE FROM food_posts WHERE id = $1", [req.params.id]);
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete post" });
  }
};


