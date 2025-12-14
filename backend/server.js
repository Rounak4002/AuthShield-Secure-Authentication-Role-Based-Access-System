const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");

const {
  authenticateToken,
  authorizeRole,
  SECRET_KEY
} = require("./authMiddleware");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Dummy users (fresher-safe, no DB yet)
const users = [
  { username: "admin", password: "admin123", role: "ADMIN" },
  { username: "user", password: "user123", role: "USER" }
];

// Login API
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { username: user.username, role: user.role },
    SECRET_KEY,
    { expiresIn: "1h" }
  );

  res.json({ message: "Login successful", token });
});

// Protected route (any logged-in user)
app.get("/profile", authenticateToken, (req, res) => {
  res.json({
    message: "Access granted to profile",
    user: req.user
  });
});

// Admin-only route
app.get(
  "/admin",
  authenticateToken,
  authorizeRole("ADMIN"),
  (req, res) => {
    res.json({ message: "Welcome Admin! Secure data access granted." });
  }
);

app.listen(4000, () => {
  console.log("AuthShield running at http://localhost:4000");
});
