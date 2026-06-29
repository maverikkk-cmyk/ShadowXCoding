const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./shadowx.db");

db.run(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT,
  password TEXT,
  role TEXT DEFAULT 'user',
  plan TEXT DEFAULT 'free'
);
`);

module.exports = db;
