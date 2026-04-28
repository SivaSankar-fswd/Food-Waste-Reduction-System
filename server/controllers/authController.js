const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET = "foodwaste_secret";

exports.register = (req, res) => {
  const { name, email, password, role, contact, location } = req.body;
  const hashed = bcrypt.hashSync(password, 8);

  const sql = `INSERT INTO users (name,email,password,role,contact,location) VALUES (?,?,?,?,?,?)`;

  db.run(sql, [name, email, hashed, role, contact, location], function(err){
    if(err){
      return res.status(400).json({error:"Email already exists"});
    }
    res.json({message:"User registered successfully.Please Login."});
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  db.get(`SELECT * FROM users WHERE email=?`, [email], (err, user)=>{
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
