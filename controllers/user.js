const { mongoUtils, dataBase } = require("../lib/utils/mongo.js");
const COLLECTION_NAME = "users";
const bcrypt = require("bcrypt");
const auth = require("../lib/utils/auth.js");
const saltRounds = 10;

async function login(user) {
  return mongoUtils.conn().then(async (client) => {
    const requestedUser = await client
      .db(dataBase)
      .collection(COLLECTION_NAME)
      .findOne({ username: user.username })
      .finally(() => client.close());

    const isValid = await bcrypt.compare(user.password, requestedUser.password);
    let currentUser = { ...requestedUser };
    if (isValid) {
      delete currentUser.password;
      let token = auth.createToken(currentUser);
      currentUser.token = token;
      return currentUser;
    } else {
      throw new Error("Authentication failed");
    }
  });
}

async function createUser(user) {
  if (user.password) {
    user.password = await bcrypt.hash(user.password, saltRounds);
  }
  if (!user.role) {
    user.role = "none";
  }
  return mongoUtils.conn().then(async (client) => {
    const newUser = await client
      .db(dataBase)
      .collection(COLLECTION_NAME)
      .insertOne(user)
      .finally(() => client.close());

    newUser && newUser.ops ? delete newUser.ops[0].password : newUser;
    return newUser.ops[0];
  });
}

async function getUsers() {
  return mongoUtils.conn().then(async (client) => {
    const usuarios = await client
      .db(dataBase)
      .collection(COLLECTION_NAME)
      .find({})
      .toArray()
      .finally(() => client.close());

    return usuarios;
  });
}

module.exports = [createUser, login, getUsers];