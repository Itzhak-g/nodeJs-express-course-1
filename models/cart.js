// starting lesson 123 -
const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
);

module.exports = class Cart {
    /*  constructor() {
        this.products = [];
        this.totalPrice = 0;
    }
}
 --- using different approach ---
    Fetch the previous cart
    Analyze the cart => Find existing product
    Add new product or increase quantity of existing product
 */
    static addProduct(id, productPrice) {
        // Fetch the previous cart
        fs.readFile(p, (err, fileContent) => {
            let cart = {products: [], totalPrice: 0};   // **** Here 'cart' is empty var, but gets its definition, before 'readFile(..)' ******
            if (!err) {     // 'products' array structure not yet defined-
                cart = JSON.parse(fileContent);     // JSON Helper; 'cart' variable gets populated by/according to the cart data file (structure).
            }
        // **** Analyzing the cart data => Find existing product
            // const existingProduct = cart.products.find(prod => prod.id === id);  // search for existing prod.id === id
            const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
        // **** Add new product / increase quantity
            if (existingProduct) {
                updatedProduct = {...existingProduct};      // spread operation; running on the object: {object}
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            } else {     // getting/adding a new product -
                updatedProduct = { id: id, qty: 1 };        //  ****  { product object gets its definition }
                cart.products = [...cart.products, updatedProduct];     //  **** adding the updated product to the 'cart.products' array *****
            }
            cart.totalPrice = cart.totalPrice + +productPrice;
            fs.writeFile(p, JSON.stringify(cart), (err) => {
                console.log(err);
            });
        });
    }
    static deleteProduct(id, productPrice) {
        fs.readFile(p, (err, fileContent) => {
            if (err) {
                return;
            }
            const updatedCart = { ...JSON.parse(fileContent) };
            //const updatedCart = { ...cart};   /  * cart does not exist here..
            //const productIndex = updatedCart.products.findIndex(prod => prod.id === id);
            //let totalProductPrice = updatedCart[productIndex].qty * productPrice;
            //updatedCart.totalPrice = updatedCart.totalPrice - totalProductPrice;
            const product = updatedCart.products.find(prod => prod.id === id);
            if (!product) {
                return;
            }
            const totalProductPrice = product.qty * productPrice;
            updatedCart.totalPrice = updatedCart.totalPrice - totalProductPrice;

            updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);

            fs.writeFile(p, JSON.stringify(updatedCart), err => {
                console.log(err);
            });
        });
    }

    static getCart(cb) {        // need to get call-back function we will call, once we get the products
        fs.readFile(p, (err, fileContent) => {
           const cart = JSON.parse(fileContent);
           if (err) {
               cb(null);
           } else {
               cb(cart);
           }
        });
    }
};

