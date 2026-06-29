const express = require("express");
const session = require("express-session");
const cors = require("cors");
const path = require("path");
const db = require("./db");

const app = express();

// Render port fix
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

app.use(
  session({
    secret: "shadowx_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// health check (Render check karega)
app.get("/", (req, res) => {
  res.send("🚀 ShadowXCoding Server Running");
});

// LOGIN API
app.post("/login", (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.json({ success: false, message: "Username missing" });
  }

  req.session.user = { username };

  db.run("INSERT INTO users(username) VALUES (?)", [username]);

  res.json({
    success: true,
    user: req.session.user,
  });
});

// GET SESSION USER
app.get("/me", (req, res) => {
  res.json({
    user: req.session.user || null,
  });
});

// LOGOUT
app.post("/logout", (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// start server (IMPORTANT for Render)
app.listen(PORT, () => {
  console.log(`ShadowXCoding running on port ${PORT}`);
});
