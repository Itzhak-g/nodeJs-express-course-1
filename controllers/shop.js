// Need to delete this line - - ->  const adminData = require("../routes/admin");
// const products = [];  - - -  no need this, as we introduced the same variable name in product.js model file..
const Product = require('../models/product');
const Order = require('../models/order');
// ??? const User = require('../models/user');
// const Cart = require('../models/cart');     -> we never used it; no need for it.
// const {getProducts} = require("./admin");   not clear why is this showing up here...
// const Order = require('../models/order');   -> we won't be needing this either..

exports.getProducts = (req, res, next) => {     // getProducts, meaning all products.
 //   Product.fetchAll()                // .findAll()  <<< used while using Sequelize...
      Product.find()                // the same, used 4 mongoose..
        .then(products => {
            console.log('getProducts -> logging all products ---');
            console.log(products);
            res.render('shop/product-list.ejs', {
                prods: products,
                pageTitle: 'All Products',     // instead of docTitle..
                path: '/products'
            });
        })
        .catch(err => {
            console.log(err);
        });
    /*  ---------------- used ^|^|^ before -------------------
      Product.fetchAll((products) => {
    /*Product.fetchAll()
        .then(([rows, fieldData]) => {
            res.render('shop/product-list.ejs', {
                prods: rows,
                pageTitle: 'All Products',     // instead of docTitle..
                path: '/products',
            });
        })
        .catch(err => console.log(err))*/
};

exports.getProduct = (req, res, next) => {      // meaning retrieving just a single product. getProduct-Id  for: 'product details'.
    const prodId = req.params.productId;        // getting the product ID as part (the suffix) of the URL
    //console.log("The product Id: ", prodId);

    /*Product.findAll({where: {id: prodId} })   // by default 'findAll' gives us multiple items, per definition..
        .then(products => {
            res.render('shop/product-detail', {     // views is the default path for viewing pages, ejs and html....
                //product: product[0],
                //pageTitle: product[0].title,
                product: products[0],
                pageTitle: products[0].title,
                path: '/products'     //path: '/' (to be compatible with the section in navigation.ejs to mark navigation item as active.)
            });                     // this is the path for which we want to mark the navigation item as active
        })
        .catch(err => console.log(err));*/
    Product.findById(prodId)  //  +++ >> from some reason 'findById' does not work with MySQL! instead working with 'findByPk', one line below.
    // Product.findByPk(prodId)        // used when working with my MySQL
        //.then(([product, fieldsData]) => {
        //.then(([product, fieldsData]) => {
        .then(product => {
            res.render('shop/product-detail', {     // views is the default path for viewing pages, ejs and html....
                //product: product[0],
                //pageTitle: product[0].title,
                product: product,
                pageTitle: product.title,
                path: '/products'     //path: '/' (to be compatible with the section in navigation.ejs to mark navigation item as active.)
            });                     // this is the path for which we want to mark the navigation item as active
        })
        .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
   /* Product.fetchAll((products) => {
    /* Product.fetchAll()
    Product
        .then(([rows, fieldData]) => {    // anonymous function  (it's not callback..)
            res.render('shop/index.ejs', {     // path to the ejs (html) content file. likely not necessary to include the file name extension.. (ejs)
                prods: rows,
                pageTitle: 'Shop-Index',     // instead of docTitle..
                path: '/',
            });
        })
        .catch(err => console.log(err));  */

    // Product.fetchAll()          //  +++ >>>  .findAll()  <<< used when using Sequelize...
    Product.find()             // used 4 mongoose..
        .then(products => {
            console.log('getIndex -> logging all products ---');
            console.log(products);
            res.render('shop/index.ejs', {
                prods: products,
                pageTitle: 'Shop-Index',
                path: '/'
            });
        })
        .catch(err => {
            console.log(err);
        });
};

// >-#>-#>-#>-#>-#>-#>-# >* * * **** * * *>-# >-# >-# >-# >-# >-# - - - loading the Cart products data onto the cart.html (ejs) form (html page). pretty simple..
exports.getCart = (req, res, next) => {
    console.log('req.user: ', req.user);     // just for understanding...
    console.log('req.user.name: ', req.user.name);
    console.log('req.user.cart :>> ', req.user.cart);   // ?? still gives us undefined.
    req.user
      //  .getCart()    // Cart, hence 'getCart', are associated to user. Cart belongs to A User !  !!this is not used with mongoose!!
        // .then(cart => {
        .populate('cart.items.productId')
        // .execPopulate()     ==> gives an error message..
        //.then(products => {
            //console.log('cart [after running req.user.getCart()] :>> ', products);   // It gives 'null' after trying to retrieve cart from 'req.user.cart'.
        .then(user => {
            console.log('user.cart.items:: ',user.cart.items);
            // console.log('req.user 2nd: ', req.user);   // ### just a test to see any potential impacts of populate() on req.user content ###
            // console.log('req.user.cart 2nd :>> ', req.user.cart);   // ### just a test to see any potential impacts of populate() on req.user content ###
            const products = user.cart.items;
            /*return cart                                                 // But after running req.use.getCart we get a valid cart.
                .getProducts()   // Since cart is associated to products. Can be multiple products.
                .then(products => {*/
                    res.render('shop/cart', {   // cart.ejs file under views/shop/
                        path: '/cart',     // url
                        pageTitle: 'Your Cart',
                        products: products
                    });
        })
                .catch(err => console.log('errors getting cart-Products : ', err));
}
/*        .catch(err => console.log('error retrieving user-Cart : ', err));
};*/

    /* Cart.getCart(cart => {    // updating - working with Sequelize instead...
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
} */
// *-*-*-*-*-*--*-*-*-*-*-*-*- Post Cart  *-*-*-*-*-*-*-*-*-*-*-*-*-    *-*-*-*-*-*-*-*-*-
// PostCart deals when user adds a new product to a cart. This may happen in one of two cases:
//   1) when no product exists in the cart so this is the first product to be added to the cart,
//   2) there are some products already existing in the cart, prior the new product is going to be added.
//   3) In any way this is not related to the products representation on the screen which is the job of the getCard method.
// postCart = > Allows for adding elements to carts -
exports.postCart = (req, res, next) => {   // product-id is included in the post message parameters sent from the html form.
    const prodId = req.body.productId;     // we want to add a product to a cart.  <input type="hidden" name="productId"
                                                    // value="<%= product._id%>">  <!-- 'name' is the  -->
    Product.findById(prodId)        // is this - findById(...) a mongoose function ?
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            console.log('result of adding product to cart :>> ', result)
            res.redirect('/cart');
        });

    // Not needed when working with MongoDB :
    /* let fetchedCart;  // a temporary global variable used to hold the cart var-data, making it available everywhere - in all methods.
    let newQuantity = 1;
    req.user
        .getCart()
        .then(cart => {     // cart is available here; we're adding access to the cart, using 'fetchedCart'.
            fetchedCart = cart;
            return cart.getProducts({where: {id: prodId} });  // publishing cart-Products
        })
        .then(products => {   // after publishing the 'products' data, retrieving the available,
            let product;
            if (products.length > 0) {
                product = products[0];
            }
            // previous: let newQuantity = 1;
            if (product) {
                // ... will be added later - the case where a product already exists
                const oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;
                return product;
            }
            // Here is the case of no product with this id that exists in the cart ---
            return Product.findByPk(prodId)     // --- so we have to find the product details in the products table.
        })
        .then(product => {
            return fetchedCart.addProduct(product, {
                through: { quantity: newQuantity }
            });
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => console.log('error getting cart & products in postCart method : ', err));
*/
    /* const prodId = req.body.productId;   // (retrieving the product-Id from the incoming request compatible with name property in the post request (productId))
    console.log("Product-Id --- " , prodId);
    Product.findByPk(prodId, (product) => {
        Cart.addProduct(prodId, product.price);
    });
    res.redirect('/cart');   // load the get route - the cart page */
};

exports.postCartDeleteProduct = (req, res, next) => {       /// Deleting a product from the cart.
    const prodId = req.body.productId;
    req.user
        // .deleteItemFromCart(prodId)    // mongoose - changing the function name to 'removeFromCart' .
        .removeFromCart(prodId)
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.log('error deleting cart.item :> ', err));

// =============== Sequelize (most likely) ================= exports.postCartDeleteProduct ============
    /* const prodId = req.body.productId;
    req.user
        .getCart()
        .then(cart => {
            return cart.getProducts({ where : { id: prodId } });    // calling db cart.getProducts
        })
        .then(products => {
            const product = products[0];
            return product.cartItem.destroy();
        })
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.log('error finding/deleting the product to be deleted: ', err)); */
/*
    Product.findByPk(prodId, product => {      // need the price of the product. run the callback with the retrieved product
        Cart.deleteProduct(prodId, product.price);
        res.redirect('/cart');
    });
*/

}

exports.postOrder = (req, res, next) => {
 //   let fetchedCart;    not needed in mongoose
    console.log('===3========99===== just entered postOrder =====99==========3===');
    req.user
        .populate('cart.items.productId')    // in product-id field; array of products data in product-id field..
        .then(user => {
            console.log('user.cart.items::>> ',user.cart.items);   // lesson 225, 0:12 minute
            const products = user.cart.items.map(i => {
                return { quantity: i.quantity, product: { ...i.productId._doc } };
            });
            const order = new Order({
                user: {
                    name: req.user.name,
                    userId: req.user
                },
                products: products
            });
            return order.save();   // saving the order to the DB.
        })
        .then(result => {
            console.log('postOrder result :++> ', result );
            return req.user.clearCart();

        })
        .then( () => {
            res.redirect('/orders');
        })

    // req.user
    //     .addOrder()     // we know the user through req.user
/*****        .getCart()    // // *** not needed when working with Mongo DB
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            console.log('retrieved cart products: ', products)
            return req.user
                .createOrder()
                .then(order => {
                    return order.addProducts(
                        products.map(product => {
                            product.orderItem = { quantity: product.cartItem.quantity };
                            return product;
                        })
                    );
                })
        })
        .then(result => {
            return fetchedCart.setProducts(null);
        })  *****/
        // .then(result => {
        //     console.log('postOrder result :++> ', result );
        //     res.redirect('/orders');
        // })
        .catch(err => console.log('error posting new order: ', err));
};

exports.getOrders = (req, res, next) => {
    Order.find( { 'user.userId': req.user._id } )    // 'user.userId' is a key name in Order schema. Its value has to equal to the logged in userId...
    //req.user
   // .getOrders({ include: ['products'] })  // used for sequelize
   // .getOrders()
      .then( orders => {
        console.log('testing orders:*: ', orders);
        res.render('shop/orders.ejs', {
            path: '/orders',
            pageTitle: 'Your Orders',
            orders: orders
        } );
    })
    .catch(err => console.log('error getting Orders: ', err));
};

/*
exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    });
}*/
