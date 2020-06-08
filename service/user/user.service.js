const bcrypt = require("bcrypt");
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
    const token = "token";
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
    const token = "token";
    return { user: foundedUser, token };
  } catch (e) {
    if(e.code === 401) {
      throw e;
    }
    throw { error: e, code: 500 };
  }
}

module.exports = { register, login };
