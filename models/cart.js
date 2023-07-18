// starting lesson 123 -
const fs = require('fs');
const path = require('path');   // path helper

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
            let cart = {products: [], totalPrice: 0};   // Here 'cart' (empty..) var gets its definition, regardless 'readFile(..)'.
            if (!err) {     // 'products' array structure not yet defined-
                cart = JSON.parse(fileContent);     // JSON Helper; 'cart' variable gets populated by the cart data file.
            }
        // **** Analyzing the cart data => Find existing product
            // const existingProduct = cart.products.find(prod => prod.id === id);  // search for existing prod.id === id
            const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
        // **** Add new product / increase quantity
            if (existingProduct) {
                updatedProduct = {...existingProduct};      // spread operation; {object}
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            } else {     // getting a new product -
                updatedProduct = { id: id, qty: 1 };        //   {object}
                cart.products = [...cart.products, updatedProduct];
            }
            cart.totalPrice = cart.totalPrice + +productPrice;
            fs.writeFile(p, JSON.stringify(cart), (err) => {
                console.log(err);
            });
        });
    }
};

