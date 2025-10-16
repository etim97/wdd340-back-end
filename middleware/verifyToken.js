const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const token = req.cookies.jwt;
  if (!token) {
    return res.redirect("/account/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.account = decoded; // 👈 Attach decoded token to request
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.clearCookie("jwt");
    return res.redirect("/account/login");
  }
}

module.exports = verifyToken;