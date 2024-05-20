require("dotenv").config();
const jwt = require("jsonwebtoken");

const authenticateMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (authHeader == null) {
    return res.status(401).json({ message: "Access token is missing" });
  }
  if (authHeader.startsWith("Bearer")) {
    const token = authHeader && authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      }
      req.user = user;
      next();
    });
  }
};

module.exports = authenticateMiddleware;
