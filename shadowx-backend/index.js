const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "shadowx_secret";

// TEST ROUTE
app.get("/", (req, res) => {
  res.json({ status: "Backend live 🚀" });
});

// LOGIN
app.post("/login", (req, res) => {
  const { username } = req.body;

  const token = jwt.sign({ username }, SECRET);

  db.run("INSERT INTO users(username) VALUES (?)", [username]);

  res.json({ token });
});

// AUTH MIDDLEWARE
function auth(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ error: "unauthorized" });
  }
}

// GET USER
app.get("/me", auth, (req, res) => {
  db.get(
    "SELECT * FROM users WHERE username=?",
    [req.user.username],
    (err, user) => {
      res.json(user);
    }
  );
});

// UPGRADE PLAN
app.post("/upgrade", auth, (req, res) => {
  const { plan } = req.body;

  db.run(
    "UPDATE users SET plan=? WHERE username=?",
    [plan, req.user.username]
  );

  res.json({ success: true });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running 🚀");
});
