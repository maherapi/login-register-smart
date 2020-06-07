const bcrypt = require("bcrypt");

users = [];

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
  users.push({...user});
  delete user.password;
  const token = "token";
  return { user, token };
}

async function login(loginCreds) {
  const { email, password } = loginCreds;
  let user = users.find((u) => u.email === email);
  if (!user) throw new Error({code: 401, message: "user not found"});
  if (!(await bcrypt.compare(password, user.password)))
    throw new Error({code: 401, message: "password does not match"});
  user = {...user}
  delete user.password;
  const token = "token";
  
  return { user, token };
}

module.exports = { register, login };
