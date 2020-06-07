const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const userService = require("./user.service");

router.post(
  "/signup",
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
      res.status(422).send({ errors: errors.array() });
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
  }
);

router.post(
  "/login",
  [
    check("email").notEmpty().isEmail()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).send({ errors: errors.array() });
      return;
    }
    const { email, password } = req.body;
    let authRes;
    try {
      authRes = await userService.login({
        email,
        password,
      });
    } catch (error) {
      res.status(401).send("wrong email or password");
    }
    res.json(authRes);
  }
);

module.exports = router;
