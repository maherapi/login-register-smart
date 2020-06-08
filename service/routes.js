const express = require("express");
const router = express.Router();

// import controllers
const userRoutes = require("./user/user.routes");
router.use("/api", userRoutes);

module.exports = router;
