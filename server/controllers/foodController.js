const db = require("../db");

exports.addFood = (req, res) => {
  const donor_id = req.userId; // from token
  const { food_name, quantity, location, contact, expiry_date, latitude, longitude, photo } = req.body;

  // Validate required fields
  if (!food_name || !quantity || !location || !contact) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const posted_date = new Date().toISOString();

  db.run(
    `INSERT INTO food_posts (donor_id, food_name, quantity, location, contact, expiry_date, posted_date, latitude, longitude, photo)
     VALUES (?,?,?,?,?, ?,?,?,?,?)`,
    [donor_id, food_name, quantity, location, contact, expiry_date, posted_date, latitude, longitude, photo],
    function(err) {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Failed to add food" });
      }
      res.json({ message: "Food posted successfully" });
    }
  );
};



exports.getFoods = (req,res) => {
  db.all(`SELECT * FROM food_posts WHERE status='available'`, [], (err,rows)=>{
    if(err) return res.status(500).json({error:"Failed to fetch"});
    res.json(rows);
  });
};

exports.updateStatus = (req,res) => {
  const { status, receiver_id } = req.body;  
  const { id } = req.params;

  // If rejected, just update status as before
  if (status === "rejected") {
    return res.json({ message: "Rejected locally" });
  }

  // If accepted → fetch receiver details and store
  db.get(
    `SELECT name, contact, location FROM users WHERE id=?`,
    [receiver_id],
    (err, receiver) => {
      if (err) return res.status(500).json({ error: "Failed to fetch receiver" });

      // ✅ ADD THIS (Generate accepted date)
      const acceptedDate = new Date().toISOString();

      db.run(
        `UPDATE food_posts 
         SET status=?, 
             receiver_id=?,
             receiver_name=?, 
             receiver_contact=?, 
             receiver_location=?,
             accepted_date=?   -- ✅ NEW COLUMN
         WHERE id=?`,
        [
          status,
          receiver_id,
          receiver.name,
          receiver.contact,
          receiver.location,
          acceptedDate,  // ✅ store date
          id
        ],
        function(err){
          if(err) return res.status(500).json({error:"Update failed"});
          res.json({message:"Status updated"});
        }
      );

    }
  );
};

exports.getDonorFoods = (req, res) => {
  const donor_id = req.userId; // coming from token

  db.all(
    `SELECT * FROM food_posts WHERE donor_id=?`,
    [donor_id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: "Failed to fetch" });
      res.json(rows);
    }
  );
};

exports.getReceiverHistory = (req, res) => {
  const receiverId = req.params.id;

  db.all(
    `SELECT * FROM food_posts 
     WHERE receiver_id = ? 
     AND status IN ('accepted','rejected')`,
    [receiverId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: "Failed to fetch history" });
      res.json(rows);
    }
  );
};

exports.deleteFood = (req, res) => {
  const donor_id = req.userId;
  const { id } = req.params;

  // 1️⃣ Check status first
  db.get(
    "SELECT status FROM food_posts WHERE id=? AND donor_id=?",
    [id, donor_id],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: "Failed to check status" });
      }

      if (!row) {
        return res.status(404).json({ error: "Post not found" });
      }

      // ❌ Block delete if accepted
      if (row.status === "accepted") {
        return res.status(403).json({
          error: "Accepted donation cannot be deleted"
        });
      }

      // 2️⃣ Allow delete only if NOT accepted
      db.run(
        "DELETE FROM food_posts WHERE id=? AND donor_id=?",
        [id, donor_id],
        function (err) {
          if (err) {
            return res.status(500).json({ error: "Failed to delete food" });
          }
          res.json({ message: "Food deleted successfully" });
        }
      );
    }
  );
};

exports.getFoodById = (req, res) => {
  const { id } = req.params;
  console.log("Fetching food with ID:", id); // Debug log
  db.get("SELECT * FROM food_posts WHERE id = ?", [id], (err, row) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ error: "Failed to fetch food details" });
    }
    if (!row) {
      console.log("No food found for ID:", id);
      return res.status(404).json({ error: "Food post not found" });
    }
    res.json(row);
  });
};




