var express = require('express');
var router = express.Router();
var [getProducts, insertProduct] = require('../controllers/product');
const auth = require('../lib/utils/auth.js')
const { roles } = require("../roles");

/* GET product listing. */
router.get('/', auth.checkToken, async function (req, res, next) {
  const products = await getProducts();
  console.warn('products->', products);
  res.send(products);const permission = roles.can(req.decoded.role).readAny("products");
  if (permission.granted) {
    const products = await getProducts();
    res.send(products);
  } else {
    res.sendStatus(403).end();
  }
});
/**
 * POST product
 */
router.post('/', auth.checkToken, async function (req, res, next) {
  const permission = roles.can(req.decoded.role).createAny("products");
  if (permission.granted) {
    const newProduct = await insertProduct(req.body);
    res.send(newProduct);
  } else {
    res.sendStatus(403).end();
  }
});

module.exports = router;
