const jwt = require("jsonwebtoken");

const SECRET_KEY = "authshield_secret_key";

// Verify token
function authenticateToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "Access token missing" });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
}

// Role-based authorization
function authorizeRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
}

module.exports = { authenticateToken, authorizeRole, SECRET_KEY };
