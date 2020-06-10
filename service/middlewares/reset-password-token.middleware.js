const moment = require("moment");
const jwt = require("jsonwebtoken");
const jwtSecret = require("../user/jwt-secret-dev");

function authenticateResetPasswordToken(req, res, next) {
  const token = req.body.reset_token;
  if (!token) {
    res.sendStatus(401);
    return;
  }

  jwt.verify(token, jwtSecret, (err, payload) => {
    if (err) {
      res.sendStatus(403);
      return;
    }
    const expires = payload.resetExpire;
    const isBefore = moment(expires).isBefore(moment.utc());
    if (isBefore) {
      res.status(403).json({ message: "time expired" });
      return;
    }
    const user = payload;
    delete user.resetExpire;
    req.user = user;
    next();
  });
}

module.exports = authenticateResetPasswordToken;
