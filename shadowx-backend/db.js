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

db.run(`
CREATE TABLE IF NOT EXISTS subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT,
  plan TEXT DEFAULT 'free',
  ai_limit INTEGER DEFAULT 20,
  used INTEGER DEFAULT 0
);
`);

module.exports = db;
