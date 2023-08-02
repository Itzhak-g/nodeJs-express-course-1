// Need to delete this line - - ->  const adminData = require("../routes/admin");
// const products = [];  - - -  no need this, as we introduced the same variable name in product.js model file..

const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/product-list.ejs', {
            prods: products,
            pageTitle: 'All Products',     // instead of docTitle..
            path: '/products',
        });
    });
};

exports.getProduct = (req, res, next) => {      // getProduct-Id
    const prodId = req.params.productId;        // product ID
    console.log("The product Id: ", prodId);
    Product.findById(prodId, product => {
        console.log(product);
        res.render('shop/product-detail', {     // views is the default path for viewing pages, ejs and html....
            product: product,
            pageTitle: product.title,
            path: '/products'     //path: '/' (to be compatible with the section in navigation.ejs to mark navigation item as active.)
        });                     // this is the path for which we want to mark the navigation item as active
    })
}

exports.getIndex = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/index.ejs', {     // path to the ejs (html) content file. likely not necessary to include the file name extension.. (ejs)
            prods: products,
            pageTitle: 'Shop-Index',     // instead of docTitle..
            path: '/',
        });
    });
}

// >->->->->->-> loading the Cart
exports.getCart = (req, res, next) => {
    Cart.getCart(cart => {
        // we just entered the first c-b function, to get the 'cart' parameter value ---
        Product.fetchAll(products => {
            // This is (we are inside -- ) the (second) call-back function..
            // const cartProducts = [];
            let cartProducts;   // inside this cart array we will put the products information to be shown on the *cart* html (ejs..)
            cartProducts = [];      // o.k. not so sure about the inner structure -> (( let cart = {products: [], totalPrice: 0}; )) -> from 'cart.js'
            for (product of products) {   // running on *products* array. NOT cart products!!!
                const cartProductData = cart.products.find(prod => prod.id === product.id);
                if(cartProductData) {
                    cartProducts.push({productData: product, qty: cartProductData.qty});
                }
            }
            res.render('shop/cart', {   // cart.ejs file under views/shop/
                path: '/cart',     // url
                pageTitle: 'Your Cart',
                products: cartProducts
            });
        });

    });
}
// *-*-*-*-*-*--*-*-*-*-*-*-*-
exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;   // (retrieving the product-Id from the incoming request compatible with name property in the post request (productId))
    console.log("Product-Id --- " , prodId);
    Product.findById(prodId, (product) => {
        Cart.addProduct(prodId, product.price);
    });
    res.redirect('/cart');   // load the get route - the cart page
};

exports.getOrders = (req, res, next) => {
    res.render('shop/orders.ejs', {
        path: '/orders',
        pageTitle: 'Your Orders'
    } );
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    });
}