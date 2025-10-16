const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const utilities = require("./utilities");
const session = require("express-session");
const flash = require("express-flash");
const path = require("path");
const cookieParser = require("cookie-parser");

const accountRoute = require("./routes/accountRoute");
const inventoryRoute = require("./routes/inventoryRoute");
const classificationRoutes = require("./routes/classification");
const staticRoutes = require("./routes/static");
const invRouter = require("./routes/inventoryRoute");

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

// Middleware
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || "secret123",
  resave: false,
  saveUninitialized: true
}));
app.use(flash());
app.use(utilities.getNav);

// Public routes
app.use("/", staticRoutes);
app.use("/classification", classificationRoutes);
app.use("/inventory", inventoryRoute);

app.use("/inv", invRouter);
app.use("/account", accountRoute); 
// ✅ Protected routes
//app.use("/account", utilities.checkJWTToken, accountRoute);
//app.use("/inventory", utilities.checkJWTToken, inventoryRoute); //

// Home route
app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render("errors/error", {
    title: "404 - Page Not Found",
    message: "Sorry, this page does not exist.",
    nav: res.locals.nav,
  });
});

// 500 handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).render("errors/error", {
    title: "Server Error",
    message: "Something went wrong on our side.",
    nav: res.locals.nav,
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});