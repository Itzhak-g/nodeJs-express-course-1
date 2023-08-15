/*
>>>  start working with sequelizing for connecting, working with the DB.  >>>
// const products = [];       We want to save our products to a file, not to array.
const wwFile = false;
const wwDb = !wwFile;
const db = require('../util/database');

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

if (wwFile) {
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
}

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        if(wwFile) {
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
            /!*fs.readFile(p, (err, fileContent) => {     no need - using same name function in 'getProductsFromFile' function above
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
            });*!/
        } else {
            return db.execute(
                'INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)', [this.title, this.price, this.imageUrl, this.description]
            );
        }
    }

    static deleteById(id) {
        if (wwFile) {
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
        } else {

        }
    }

    static fetchAll() {        // 'static' - enable to run the function on the class itself, not on instantiate object. Originally: 'fetchAll(cb) {'
        //return this.products;    no products property in the class. only the external products array. that's why use instead - :
        // return products;     (before using file to save the products..)
        if (wwFile) {
            /!*const p = path.join(     >>>>>  refactoring the code - moved up to 'getProductsFromFile'.
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
        });*!/
            // return products;
            getProductsFromFile(cb);
        } else {
            return db.execute('SELECT * FROM products');
                /!*.then(result => {     being skipped for a while...
                    console.log(result[0], result[1]);
                })
                .catch(err => {
                    console.log('Have an error: ',err)
                });*!/
        }
    }

    static findById(id) {     //  getProduct-By-Id;  Call Back (cb) function will be executed once we are done finding the product.  Originally: 'findById(id, cb) {'
        if (wwFile) {
            getProductsFromFile(products => {
                const product = products.find(p => p.id === id);     // synchronous function code
                cb(product);
            });
        } else {
            return db.execute('SELECT * FROM products WHERE id = ?', [id]);
        }
    }
};
*/
const Sequelize = require('sequelize');

const sequelize = require('../util/database');

// Product Model Follows:
const Product = sequelize.define('product', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: Sequelize.STRING,
    price: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    imageUrl: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Product;