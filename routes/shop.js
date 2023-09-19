const express = require('express');
const path = require("path");

/*
const rootDir = require('../util/path');    ->  no longer needed..
const adminData = require('./admin');       ->  no longer needed..
*/
const shopController = require('../controllers/shop');

const router = express.Router();    // calling 'express.Router()' as a function

// router.get('/', shopController.getProducts);
router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId',shopController.getProduct);     // : dynamic segment. to display a new page -> get

router.get('/cart', shopController.getCart);        // get request -> used to display the cart

router.post('/cart', shopController.postCart);        // need new controller function..

router.post('/cart-delete-item', shopController.postCartDeleteProduct);

router.post('/create-order', shopController.postOrder);

router.get('/orders', shopController.getOrders);

// Not used yet >>> router.get('/checkout', shopController.getCheckout);

module.exports = router;
