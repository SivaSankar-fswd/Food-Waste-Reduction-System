const jwt = require("jsonwebtoken");
const SECRET = "foodwaste_secret";

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(403).json({ error: "No token provided" });

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Unauthorized" });

    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};
