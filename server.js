const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const utilities = require("./utilities");

// View Engine and Templates
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

// Static files (for CSS, JS, images)
app.use(express.static("public"));

// Make navigation available globally
app.use(utilities.getNav);

// Static routes
app.use(static);

// Classification routes
const classificationRoutes = require("./routes/classification");
app.use("/classification", classificationRoutes);

// Inventory routes (for vehicle detail)
const inventoryRoutes = require("./routes/inventoryRoute");
app.use("/inventory", inventoryRoutes);

// Home route
app.get("/", (req, res) => {
  res.render("index", { title: "Custom" });
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

// ✅ Server info (Render-compatible)
const port = process.env.PORT || 3000;

app.listen(port, "0.0.0.0", () => {
  console.log(`✅ App listening on port ${port}`);
});
