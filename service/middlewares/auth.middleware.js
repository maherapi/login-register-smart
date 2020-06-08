const jwt = require("jsonwebtoken");
const jwtSecret = require("../user/jwt-secret-dev");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.sendStatus(401);
    return;
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      res.sendStatus(403);
      return;
    }

    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
