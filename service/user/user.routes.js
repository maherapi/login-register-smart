const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const userService = require("./user.service");

router.post(
  "/auth/signup",
  [
    check("username")
      .notEmpty()
      .matches(/[a-z]{5}/),
    check("first_name").notEmpty().trim().isLength({ min: 3, max: 30 }),
    check("last_name").notEmpty().trim().isLength({ min: 3, max: 30 }),
    check("gender").notEmpty().isIn(["male", "female"]),
    check("email").notEmpty().isEmail(),
    check("phone_number").notEmpty().isMobilePhone("ar-SA"),
    check("password").notEmpty().isLength({ min: 8, max: 20 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    const {
      first_name,
      last_name,
      gender,
      email,
      phone_number,
      username,
      password,
    } = req.body;
    try {
      const authRes = await userService.register({
        first_name,
        last_name,
        gender,
        email,
        phone_number,
        username,
        password,
      });
      res.json(authRes);
    } catch (e) {
      res.status(e.code).json(e.error);
    }
  }
);

router.post(
  "/auth/login",
  [check("email").notEmpty().isEmail()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    const { email, password } = req.body;
    let authRes;
    try {
      authRes = await userService.login({
        email,
        password,
      });
    } catch (e) {
      if (e.code === 401) {
        res.status(401).json({ message: "wrong email or password" });
      } else {
        res.status(e.code).json(e);
      }
    }
    res.json(authRes);
  }
);

module.exports = router;
