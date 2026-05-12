const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const SECRET = "foodwaste_secret";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.register = (req, res) => {
  const { name, email, password, role, contact, location } = req.body;
  const hashed = bcrypt.hashSync(password, 8);

  const sql = `INSERT INTO users (name,email,password,role,contact,location) VALUES (?,?,?,?,?,?)`;

  db.run(sql, [name, email, hashed, role, contact, location], function(err){
    if(err){
      console.error("Registration Error:", err);
      // In PostgreSQL, unique violation code is 23505
      if (err.code === '23505') {
        return res.status(400).json({error:"Email already exists"});
      }
      return res.status(500).json({error:"Database connection error. Check server logs."});
    }
    res.json({message:"User registered successfully.Please Login."});
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  db.get(`SELECT * FROM users WHERE email=?`, [email], (err, user)=>{
    if (err) {
      console.error("Login Database Error:", err);
      return res.status(500).json({error: "Database error during login"});
    }
    if(!user) return res.status(404).json({error:"User not found"});

    const passOk = bcrypt.compareSync(password, user.password);
    if(!passOk) return res.status(401).json({error:"Invalid password"});

    const token = jwt.sign({id:user.id, role:user.role}, SECRET, {expiresIn:"1d"});

    res.json({
  message: "Login success",
  token: token,
  role: user.role,
  id: user.id
});


  });
};

exports.googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    // Check if user exists
    db.get(`SELECT * FROM users WHERE email=?`, [email], (err, user) => {
      if (err) {
        console.error("Google Login DB Error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (user) {
        // User exists, login
        const jwtToken = jwt.sign({ id: user.id, role: user.role }, SECRET, {
          expiresIn: "1d",
        });
        return res.json({
          message: "Login success",
          token: jwtToken,
          role: user.role,
          id: user.id,
        });
      } else {
        // User doesn't exist, create new user
        const placeholderPassword = bcrypt.hashSync(Math.random().toString(36), 8);
        const role = "donor"; // Default role for Google login

        const sql = `INSERT INTO users (name, email, password, role, photo) VALUES (?, ?, ?, ?, ?) RETURNING id`;
        
        // Using pool.query directly to use RETURNING id easily if supported by the db wrapper or pool
        db.pool.query(
          "INSERT INTO users (name, email, password, role, photo) VALUES ($1, $2, $3, $4, $5) RETURNING id, role",
          [name, email, placeholderPassword, role, picture],
          (err, result) => {
            if (err) {
              console.error("Google Register Error:", err);
              return res.status(500).json({ error: "Could not create user" });
            }

            const newUser = result.rows[0];
            const jwtToken = jwt.sign({ id: newUser.id, role: newUser.role }, SECRET, {
              expiresIn: "1d",
            });

            res.json({
              message: "Google Registration and Login success",
              token: jwtToken,
              role: newUser.role,
              id: newUser.id,
            });
          }
        );
      }
    });
  } catch (error) {
    console.error("Google Verify Error:", error);
    res.status(400).json({ error: "Invalid Google token" });
  }
};

