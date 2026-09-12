const jwt = require("jsonwebtoken");
// ================= AUTH =================
const auth = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token, access denied",
      });
    }

    const token = authHeader.split(" ")[1];
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    req.user = verified;

    next();
  } catch (err) {
  return res.status(401).json({
    success: false,
    message: "Invalid token",
  });
}
};

// ================= ADMIN =================
const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin only access",
    });
  }

  next();
};

//console.log("AUTH MIDDLEWARE LOADED");

module.exports = { auth, adminOnly };