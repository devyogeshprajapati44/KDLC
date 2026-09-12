const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header is missing.",
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format. Use Bearer token.",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing.",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    console.log("Authenticated User:", req.user);

    next();

  } catch (error) {

    console.error("JWT ERROR:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};


// =====================================================
// ROLE AUTHORIZATION
// =====================================================

const authorize = (...roles) => {
  return (req, res, next) => {

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    // SUPER ADMIN = FULL ACCESS
    if (req.user.role === "SUPER_ADMIN") {
      return next();
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    next();
  };
};

module.exports = {
  auth,
  authorize,
};