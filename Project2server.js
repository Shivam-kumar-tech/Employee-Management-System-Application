const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 3000;

// In-memory store
let employees = [];
const admins = [
  { username: "admin", password: "admin123" },
  { username: "shivam", password: "shivam123" },
  { username: "neha", password: "neha123" } // Add more if needed
];

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: "crud_secret",
  resave: false,
  saveUninitialized: false,
}));
app.use(express.static(path.join(__dirname, "public")));

// Auth check
function isAuthenticated(req, res, next) {
  if (req.session.user){
    next();
  } else {
    res.redirect("/Project2login.html");
  }
}

// Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = admins.find(u => u.username === username && u.password === password);
  
  if (user) {
    req.session.user = user.username;
    res.redirect("/Project2dashboard.html");
  } else {
    res.send("Invalid credentials");
  }
});


// Logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/Project2login.html");
  });
});

// APIs
app.get("/api/employees", isAuthenticated, (req, res) => {
  res.json(employees);
});

app.post("/api/employees", isAuthenticated, (req, res) => {
  const { name, role, email } = req.body;
  const id = Date.now().toString();
  employees.push({ id, name, role, email });
  res.redirect("/Project2dashboard.html");
});

app.post("/api/employees/delete", isAuthenticated, (req, res) => {
  const { id } = req.body;
  employees = employees.filter(emp => emp.id !== id);
  res.redirect("/Project2dashboard.html");
});

app.post("/api/employees/update", isAuthenticated, (req, res) => {
  const { id, name, role, email } = req.body;
  const employee = employees.find(emp => emp.id === id);
  if (employee) {
    employee.name = name;
    employee.role = role;
    employee.email = email;
  }
  res.redirect("/Project2dashboard.html");
});

app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
