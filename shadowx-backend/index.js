const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const db = require("./db");
const { auth, isAdmin, SECRET } = require("./auth");

const app = express();
app.use(cors());
app.use(express.json());

/* ROOT */
app.get("/", (req, res) => res.json({ status: "ShadowX live 🚀" }));

/* REGISTER */
app.post("/register", (req, res) => {
  const { username, password } = req.body;

  db.run("INSERT INTO users(username,password) VALUES(?,?)", [username, password]);

  db.run("INSERT INTO subscriptions(username) VALUES(?)", [username]);

  res.json({ msg: "User created" });
});

/* LOGIN */
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.get(
    "SELECT * FROM users WHERE username=? AND password=?",
    [username, password],
    (err, user) => {
      if (!user) return res.json({ error: "Invalid" });

      const token = jwt.sign(
        { username: user.username, role: user.role, plan: user.plan },
        SECRET,
        { expiresIn: "1h" }
      );

      res.json({ token });
    }
  );
});

/* SUBSCRIPTION */
app.get("/me/subscription", auth, (req, res) => {
  db.get(
    "SELECT * FROM subscriptions WHERE username=?",
    [req.user.username],
    (err, sub) => res.json(sub)
  );
});

/* UPGRADE */
app.post("/upgrade", auth, (req, res) => {
  const { plan } = req.body;

  let limit = plan === "pro" ? 500 : 20;

  db.run(
    "UPDATE subscriptions SET plan=?, ai_limit=? WHERE username=?",
    [plan, limit, req.user.username]
  );

  res.json({ msg: "Upgraded 🚀" });
});

/* AI */
app.post("/ai", auth, (req, res) => {
  const { prompt } = req.body;

  db.get(
    "SELECT * FROM subscriptions WHERE username=?",
    [req.user.username],
    async (err, sub) => {

      if (sub.used >= sub.ai_limit) {
        return res.json({ error: "Limit reached 🚫" });
      }

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer YOUR_GROQ_API_KEY"
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [{ role: "user", content: prompt }]
        })
      });

      const data = await response.json();

      db.run(
        "UPDATE subscriptions SET used = used + 1 WHERE username=?",
        [req.user.username]
      );

      res.json({ reply: data?.choices?.[0]?.message?.content });
    }
  );
});

/* ADMIN */
app.get("/admin/users", auth, isAdmin, (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => res.json(rows));
});

/* START */
app.listen(process.env.PORT || 3000, () => {
  console.log("Backend running 🚀");
});
