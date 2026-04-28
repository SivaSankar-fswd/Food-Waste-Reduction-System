const db = require("../db");

exports.getProfile = (req, res) => {
  const userId = req.userId;

  db.get("SELECT id, name, email, role, contact, location, photo FROM users WHERE id = ?", [userId], (err, user) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  });
};

exports.updateProfile = (req, res) => {
  const userId = req.userId;
  const { name, email, contact, location, photo } = req.body;

  console.log("Updating profile for user:", userId);
  console.log("Photo data length:", photo ? photo.length : "null");

  // Validate required fields
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  db.run(
    "UPDATE users SET name = ?, email = ?, contact = ?, location = ?, photo = ? WHERE id = ?",
    [name, email, contact || null, location || null, photo || null, userId],
    function (err) {
      if (err) {
        console.error("Database update error:", err);
        return res.status(500).json({ error: "Failed to update profile" });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      console.log("Profile updated successfully for user:", userId);
      res.json({ message: "Profile updated successfully" });
    }
  );
};
