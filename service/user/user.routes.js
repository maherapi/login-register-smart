const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const multer = require("multer");

const authMiddlware = require("../middlewares/auth.middleware");
const authenticateResetPasswordToken = require("../middlewares/reset-password-token.middleware");

const {
  storage,
  fileFilter,
  limits,
  SIZE_LIMIT_MB,
} = require("./profile-photo-storage-config");
const upload = multer({ storage, fileFilter, limits });

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

router.get("/user", authMiddlware, async (req, res) => {
  const userId = req.user && req.user.id;
  try {
    const foundedUser = await userService.getUserInfo(userId);
    res.json(foundedUser);
  } catch (e) {
    res.status(e.code).json(e.error);
  }
});

router.put("/user", authMiddlware, async (req, res) => {
  const userId = req.user && req.user.id;
  const {
    first_name,
    last_name,
    gender,
    email,
    phone_number,
    username,
  } = req.body;
  try {
    const updatedUser = await userService.updateUserInfo(userId, {
      first_name,
      last_name,
      gender,
      email,
      phone_number,
      username,
    });
    res.json(updatedUser);
  } catch (e) {
    res.status(e.code).json(e.error);
  }
});

router.post("/user/photo", authMiddlware, async (req, res) => {
  upload.single("profile_photo")(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        res
          .status(400)
          .json({ message: `file size must be less than ${SIZE_LIMIT_MB} MB` });
      }
      res.status(400).json({ message: err.code });
    } else if (err) {
      res.status(500).json(err);
    }
    const userId = req.user.id;
    try {
      const updatedUser = await userService.updateProfilePhotoPath(
        userId,
        req.file.filename
      );
      res.json(updatedUser);
    } catch (e) {
      res.status(e.code || 500).json(e.error);
    }
  });
});

router.post(
  "/auth/password",
  authMiddlware,
  [
    check("email").notEmpty().isEmail(),
    check("old_password").notEmpty().isLength({ min: 8, max: 20 }),
    check("new_password").notEmpty().isLength({ min: 8, max: 20 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    const userId = req.user && req.user.id;
    const emailFromToken = req.user && req.user.email;
    const { email, old_password, new_password } = req.body;
    if (email !== emailFromToken) {
      res.status(401).json({ message: "email does not match" });
    }
    try {
      const updatedUser = await userService.changePassword(
        userId,
        old_password,
        new_password
      );
      res.json(updatedUser);
    } catch (e) {
      res.status(e.code).json(e.error);
    }
  }
);

router.post(
  "/auth/password/resetlink",
  [check("email").notEmpty().isEmail()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    const { email } = req.body;
    try {
      const authData = await userService.resetPasswordToken(email);
      res.json(authData);
    } catch (e) {
      res.status(e.code).json(e.error);
    }
  }
);

router.post(
  "/auth/password/reset",
  authenticateResetPasswordToken,
  check("new_password").notEmpty().isLength({ min: 8, max: 20 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    const userId = req.user && req.user.id;
    const { new_password } = req.body;
    try {
      const updatedUser = await userService.resetPassword(userId, new_password);
      res.json(updatedUser);
    } catch (e) {
      res.status(e.code).json(e.error);
    }
  }
);

module.exports = router;
