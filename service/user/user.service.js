const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const jwtSecret = require("./jwt-secret-dev");

const db = require("../models");

async function register(signupCreds) {
  const {
    first_name,
    last_name,
    gender,
    email,
    phone_number,
    username,
    password,
  } = signupCreds;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = {
    first_name,
    last_name,
    gender,
    email,
    phone_number,
    username,
    password: hashedPassword,
  };
  let registeredUser;
  try {
    registeredUser = await db.User.create(user);
    delete registeredUser.dataValues.password;
    const token = generateToken(registeredUser.dataValues);
    return { user: registeredUser.dataValues, token };
  } catch (e) {
    if (e.name === "SequelizeUniqueConstraintError") {
      throw { error: { message: "user already exists" }, code: 409 };
    } else {
      throw { error: e, code: 500 };
    }
  }
}

async function login(loginCreds) {
  const { email, password } = loginCreds;
  try {
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      throw { code: 401, error: { message: "user not found" } };
    }
    const foundedUser = user.dataValues;
    if (!(await bcrypt.compare(password, foundedUser.password))) {
      throw { code: 401, error: { message: "password does not match" } };
    }
    delete foundedUser.password;
    const token = generateToken(foundedUser);
    return { user: foundedUser, token };
  } catch (e) {
    if (e.code === 401) {
      throw e;
    }
    throw { error: e, code: 500 };
  }
}

async function getUserInfo(userId) {
  if (!userId) {
    throw { code: 400, error: { message: "user id missing" } };
  }
  const foundedUser = await db.User.findByPk(userId);
  if (!foundedUser) {
    throw { code: 404, error: { message: "user not found" } };
  }
  delete foundedUser.dataValues.password;
  return foundedUser;
}

async function updateUserInfo(userId, user) {
  if (!userId) {
    throw { code: 400, error: { message: "user id missing" } };
  }
  const foundedUser = await db.User.findByPk(userId);
  const updatedUser = await foundedUser.update(user);
  delete updatedUser.dataValues.password;
  return updatedUser;
}

async function updateProfilePhotoPath(userId, path) {
  if (!userId) {
    throw { code: 400, error: { message: "user id missing" } };
  }
  const foundedUser = await db.User.findByPk(userId);
  const updatedUser = await foundedUser.update({ profile_photo_path: path });
  delete updatedUser.dataValues.password;
  return updatedUser;
}

async function changePassword(userId, old_password, new_password) {
  if (!userId) {
    throw { code: 400, error: { message: "user id missing" } };
  }
  if (!new_password) {
    throw { code: 400, error: { message: "new password missing" } };
  }
  if (!new_password) {
    throw { code: 400, error: { message: "old password missing" } };
  }
  const user = await db.User.findByPk(userId);
  const userData = user.dataValues;
  if (!(await bcrypt.compare(old_password, userData.password))) {
    throw { code: 401, error: { message: "password does not match" } };
  }
  const hashedNewPassword = await bcrypt.hash(new_password, 10);
  const updatedUser = await user.update({ password: hashedNewPassword });
  delete updatedUser.dataValues.password;
  return updatedUser;
}

function generateToken(user) {
  const token = jwt.sign(user, jwtSecret);
  return token;
}

module.exports = {
  register,
  login,
  getUserInfo,
  updateUserInfo,
  updateProfilePhotoPath,
  changePassword,
};
