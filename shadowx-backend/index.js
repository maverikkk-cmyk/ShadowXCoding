const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const db = require("./db");
const { auth, isAdmin, isSuperAdmin, SECRET } = require("./auth");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ShadowX backend running 🚀" });
});


// 👤 REGISTER (test)
app.post("/register", (req, res) => {
  const { username, password } = req.body;

  db.run(
    "INSERT INTO users(username,password) VALUES(?,?)",
    [username, password]
  );

  res.json({ msg: "User created" });
});


// 🔐 LOGIN
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.get(
    "SELECT * FROM users WHERE username=? AND password=?",
    [username, password],
    (err, user) => {
      if (!user) return res.json({ error: "Invalid login" });

      const token = jwt.sign(
        {
          username: user.username,
          role: user.role,
          plan: user.plan
        },
        SECRET,
        { expiresIn: "1h" }
      );

      res.json({ token });
    }
  );
});


// 👤 USER INFO
app.get("/me", auth, (req, res) => {
  db.get(
    "SELECT * FROM users WHERE username=?",
    [req.user.username],
    (err, user) => {
      res.json(user);
    }
  );
});


// 💎 UPGRADE PLAN
app.post("/upgrade", auth, (req, res) => {
  const { plan } = req.body;

  db.run(
    "UPDATE users SET plan=? WHERE username=?",
    [plan, req.user.username]
  );

  res.json({ msg: "Plan updated" });
});


// 👑 ADMIN PANEL
app.get("/admin", auth, isAdmin, (req, res) => {
  res.json({ msg: "Admin panel access granted ⚙️" });
});


// 🚀 SUPER ADMIN TEST
app.get("/super", auth, isSuperAdmin, (req, res) => {
  res.json({ msg: "Super admin 👑" });
});


// START
app.listen(process.env.PORT || 3000, () => {
  console.log("Backend running 🚀");
});
