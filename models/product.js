// const products = [];       We want to save our products to a file, not to array.
const wwFile = true;
const wwDb = false;

if (wwFile) {
    const fs = require('fs');
    const path = require('path');
}
const Cart = require('./cart');

if (wwFile) {
    const p = path.join(
        path.dirname(process.mainModule.filename),
        'data',
        'products.json'
    );
}

const getProductsFromFile = cb => {         // This is helper function ...

    fs.readFile(p, (err, fileContent) => {      // Asynchronous code..
        if (err) {
            //return [];
            cb([]);
        } else {
            //return JSON.parse(fileContent);
            cb(JSON.parse(fileContent));
        }
    });
};

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }
    save() {
        getProductsFromFile(products => {      //parameter compatible with cb <<<<<<<
            if (this.id) {      // adding additional existing product, increasing its quantity by one..
                const existingProductIndex = products.findIndex(prod => prod.id === this.id);
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(p, JSON.stringify(updatedProducts) , err => {
                    console.log(err);
                });
            } else {        // adding a new product - not yet shown in the cart..
                this.id = Math.random().toString();     // creating new id for the new product
                products.push(this);
                fs.writeFile(p, JSON.stringify(products), (err) => {
                    console.log(err);
                });
            }
        });
        /*fs.readFile(p, (err, fileContent) => {     no need - using same name function in 'getProductsFromFile' function above
            // console.log(err);
            // console.log(fileContent);
            /!*  let products = [];     // >>>>> we do not need this logic...
            if (!err) {
                products = JSON.parse(fileContent);
            }   *!/
            /!*products.push(this);        // we are interested in this logic only.  passed, instead, as a parameter to 'getProductFromFile'
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log(err);
            });*!/
        });*/
    }

    static deleteById(id) {
        getProductsFromFile(products => {       //   cb(JSON.parse(fileContent)); equals to = products..
            const productIndex = products.findIndex(p => p.id === id);   // synchronous function code. (read below)
            //we don't need above line, using instead the following in order to retrieve product.price :
            const product = products.find(prd => prd.id === id);
            const updatedProducts = products.filter(p => p.id !== id);
            fs.writeFile(p, JSON.stringify(updatedProducts), err => {     //callback function starts at 'err'.
                if (!err) {
                    // removing the product from the cart will start here:
                    Cart.deleteProduct(id, product.price);
                }
            });
        });
    }

    static fetchAll(cb) {        // 'static' - enable to run the function on the class itself, not on instantiate object
        //return this.products;    no products property in the class. only the external products array. that's why use instead - :
        // return products;     (before using file to save the products..)
        /*const p = path.join(     >>>>>  refactoring the code - moved up to 'getProductsFromFile'.
            path.dirname(process.mainModule.filename),
            'data',
            'products.json'
        );
        fs.readFile(p, (err, fileContent) => {      // Asynchronous code..
            if (err) {
                //return [];
                cb([]);
            }
            //return JSON.parse(fileContent);
            cb(JSON.parse(fileContent));
        });*/
        // return products;
        getProductsFromFile(cb);
    }

    static findById(id, cb) {     //  getProduct-By-Id;  Call Back (cb) function will be executed once we are done finding the product
        getProductsFromFile(products => {
           const product = products.find(p => p.id === id);     // synchronous function code
           cb(product);
        });
    }
};
