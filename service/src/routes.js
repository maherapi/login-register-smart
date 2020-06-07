const express = require("express");
const router = express.Router();

// import controllers
const userRoutes = require("./user/user.routes");
router.use("/api/auth", userRoutes);

module.exports = router;
