const jwt = require("jsonwebtoken");

const SECRET = "shadowx_secret";

// AUTH CHECK
function auth(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ error: "No token" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// ADMIN CHECK
function isAdmin(req, res, next) {
  if (req.user.role !== "admin" && req.user.role !== "superadmin") {
    return res.status(403).json({ error: "Admin only" });
  }
  next();
}

// SUPER ADMIN CHECK
function isSuperAdmin(req, res, next) {
  if (req.user.role !== "superadmin") {
    return res.status(403).json({ error: "Super admin only" });
  }
  next();
}

module.exports = { auth, isAdmin, isSuperAdmin, SECRET };
