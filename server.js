const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const utilities = require("./utilities");
const session = require('express-session')
const flash = require('express-flash')
const path = require("path");


// View Engine and Templates
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

// ✅ Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(utilities.getNav);
app.use(session({
  secret: process.env.SESSION_SECRET || "secret123",
  resave: false,
  saveUninitialized: true
}));
app.use(flash());

// Static files (for CSS, JS, images)
app.use(express.static("public"));

// Make navigation available globally
app.use(utilities.getNav);

// Static routes
app.use(static);

// Home route
app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});


// Classification routes
const classificationRoutes = require("./routes/classification");
app.use("/classification", classificationRoutes);

// Inventory routes (for vehicle detail)
const inventoryRoutes = require("./routes/inventoryRoute");
app.use("/inventory", inventoryRoutes);

const invRouter = require('./routes/inventoryRoute')
app.use('/inv', invRouter)

// Home route
app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

// 404 handler (must be last)
app.use((req, res) => {
  res.status(404).render("errors/error", {
    title: "404 - Page Not Found",
    message: "Sorry, this page does not exist.",
    nav: res.locals.nav,
  });
});

// 500 handler (must be last)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).render("errors/error", {
    title: "Server Error",
    message: "Something went wrong on our side.",
    nav: res.locals.nav,
  });
});


// Server info

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

