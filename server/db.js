const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./shadowx.db");

// USERS TABLE
db.run(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT
)
`);

module.exports = db;
