const express = require('express');
const path = require("path");
// const rootDir = require('../util/path');   = we don't need the rootDir.  [section 7 MVC lesson 98]

// const productsController = require('../controllers/shop');   since we changed the content between shop & admin controllers files.
const adminController = require('../controllers/admin');
// const {postEditProduct} = require("../controllers/admin");    -  probably may be deleted..

const router = express.Router();

// const products = [];     [moved to products controller..]

    //   /admin/add-product    ==> GET       ***
router.get('/add-product', adminController.getAddProduct);   // referring to products controller

    //   /admin/add-product    ==> GET       &&&
router.get('/products', adminController.getProducts);

    //   /admin/add-product      ==> POST
router.post('/add-product',adminController.postAddProduct);  // referring to products controller

router.get('/edit-product/:productId' ,adminController.getEditProduct);

router.post('/edit-product', adminController.postEditProduct);

router.post('/delete-product', adminController.postDeleteProduct);

/*
 --- don't erase ---
exports.routes = router;        -> as we are doing it in the shop.js file.
exports.products = products;    -> we no longer have the products array here ...
*/

module.exports = router;     // like we are doing in the shop.js file.
