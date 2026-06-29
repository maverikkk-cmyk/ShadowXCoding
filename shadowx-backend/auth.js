const jwt = require("jsonwebtoken");
const SECRET = "shadowx_secret";

function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.json({ error: "No token" });

  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.json({ error: "Invalid token" });
  }
}

function isAdmin(req, res, next) {
  if (req.user.role !== "admin" && req.user.role !== "superadmin") {
    return res.json({ error: "Admin only" });
  }
  next();
}

module.exports = { auth, isAdmin, SECRET };
