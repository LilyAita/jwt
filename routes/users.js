var express = require('express');
var router = express.Router();
var [createUser, login] = require('../controllers/user');
const auth = require('../lib/utils/auth.js')
const { roles } = require("../roles");
/* Create user. */
router.post('/register', async function(req, res, next) {
  const newUser = await createUser(req.body);
  res.send(newUser);
});
/** Login */
router.post('/login', async function(req, res, next) {
    const authUser = await login(req.body);
    res.send(authUser);
});

router.get("/", auth.checkToken, async function (req, res, next) {
  const permission = roles.can(req.decoded.role).readAny("auth");
  if (permission.granted) {
    const users = await getUsers();
    res.send(users);
  } else {
    res.sendStatus(403).end();
  }
});
module.exports = router;
