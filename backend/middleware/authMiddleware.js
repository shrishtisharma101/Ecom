const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not configured.");
    return res.status(500).json({
      success: false,
      message: "Authentication is not configured",
    });
  }

  const authorization = req.headers.authorization;
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token",
    });
  }
};

module.exports = authenticateUser;