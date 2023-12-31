const mongoose = require('mongoose');

const Schema = mongoose.Schema;   // Schema constructor

// data definition, blue print, schema for our products
const productSchema = new Schema({    // 'Schema' constructor allows us to create new schemas.
    title: {                        // not need to define here '_id' , as it's still being added automatically as an 'ObjectId'.
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

// mongoose also works with what so-called "models"

module.exports = mongoose.model('Product', productSchema);


// /*
// >>>  start working with sequelizing for connecting, working with the DB.  >>>
// // const products = [];       We want to save our products to a file, not to array.
// const wwFile = false;   // => work with File
// const wwDb = !wwFile;
// const db = require('../util/database');
//
// if (wwFile) {   //  => work with File
//     const fs = require('fs');
//     const path = require('path');
// }
// const Cart = require('./cart');
//
// if (wwFile) {
//     const p = path.join(
//         path.dirname(process.mainModule.filename),
//         'data',
//         'products.json'
//     );
// }
//
// if (wwFile) {
//     const getProductsFromFile = cb => {         // This is helper function ...
//
//         fs.readFile(p, (err, fileContent) => {      // Asynchronous code..
//             if (err) {
//                 //return [];
//                 cb([]);
//             } else {
//                 //return JSON.parse(fileContent);
//                 cb(JSON.parse(fileContent));
//             }
//         });
//     };
// }
//
// module.exports = class Product {
//     constructor(id, title, imageUrl, description, price) {
//         this.title = title;
//         this.imageUrl = imageUrl;
//         this.description = description;
//         this.price = price;
//     }
//
//     save() {
//         if(wwFile) {
//             getProductsFromFile(products => {      //parameter compatible with cb <<<<<<<
//                 if (this.id) {      // adding additional existing product, increasing its quantity by one..
//                     const existingProductIndex = products.findIndex(prod => prod.id === this.id);
//                     const updatedProducts = [...products];
//                     updatedProducts[existingProductIndex] = this;
//                     fs.writeFile(p, JSON.stringify(updatedProducts) , err => {
//                         console.log(err);
//                     });
//                 } else {        // adding a new product - not yet shown in the cart..
//                     this.id = Math.random().toString();     // creating new id for the new product
//                     products.push(this);
//                     fs.writeFile(p, JSON.stringify(products), (err) => {
//                         console.log(err);
//                     });
//                 }
//             });
//             /!*fs.readFile(p, (err, fileContent) => {     no need - using same name function in 'getProductsFromFile' function above
//                 // console.log(err);
//                 // console.log(fileContent);
//                 /!*  let products = [];     // >>>>> we do not need this logic...
//                 if (!err) {
//                     products = JSON.parse(fileContent);
//                 }   *!/
//                 /!*products.push(this);        // we are interested in this logic only.  passed, instead, as a parameter to 'getProductFromFile'
//                 fs.writeFile(p, JSON.stringify(products), (err) => {
//                     console.log(err);
//                 });*!/
//             });*!/
//         } else {
//             return db.execute(
//                 'INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)', [this.title, this.price, this.imageUrl, this.description]
//             );
//         }
//     }
//
//     static deleteById(id) {
//         if (wwFile) {
//             getProductsFromFile(products => {       //   cb(JSON.parse(fileContent)); equals to = products..
//                 const productIndex = products.findIndex(p => p.id === id);   // synchronous function code. (read below)
//                 //we don't need above line, using instead the following in order to retrieve product.price :
//                 const product = products.find(prd => prd.id === id);
//                 const updatedProducts = products.filter(p => p.id !== id);
//                 fs.writeFile(p, JSON.stringify(updatedProducts), err => {     //callback function starts at 'err'.
//                     if (!err) {
//                         // removing the product from the cart will start here:
//                         Cart.deleteProduct(id, product.price);
//                     }
//                 });
//             });
//         } else {
//
//         }
//     }
//
//     static fetchAll() {        // 'static' - enable to run the function on the class itself, not on instantiate object. Originally: 'fetchAll(cb) {'
//         //return this.products;    no products property in the class. only the external products array. that's why use instead - :
//         // return products;     (before using file to save the products..)
//         if (wwFile) {
//             /!*const p = path.join(     >>>>>  refactoring the code - moved up to 'getProductsFromFile'.
//             path.dirname(process.mainModule.filename),
//             'data',
//             'products.json'
//         );
//         fs.readFile(p, (err, fileContent) => {      // Asynchronous code..
//             if (err) {
//                 //return [];
//                 cb([]);
//             }
//             //return JSON.parse(fileContent);
//             cb(JSON.parse(fileContent));
//         });*!/
//             // return products;
//             getProductsFromFile(cb);
//         } else {
//             return db.execute('SELECT * FROM products');
//                 /!*.then(result => {     being skipped for a while...
//                     console.log(result[0], result[1]);
//                 })
//                 .catch(err => {
//                     console.log('Have an error: ',err)
//                 });*!/
//         }
//     }
//
//     static findById(id) {     //  getProduct-By-Id;  Call Back (cb) function will be executed once we are done finding the product.  Originally: 'findById(id, cb) {'
//         if (wwFile) {    // in case of working with file, only. NOT DB of any kinds.
//             getProductsFromFile(products => {
//                 const product = products.find(p => p.id === id);     // synchronous function code
//                 cb(product);
//             });
//         } else {
//             return db.execute('SELECT * FROM products WHERE id = ?', [id]);
//         }
//     }
// };

// */
// /*** const Sequelize = require('sequelize');    // we are not using sequelize in the class anymore
//   const sequelize = require('../util/database');     // we are not using sequelize in the class anymore ***/
// // const mongoConnect = require('../util/database');
// const mongodb = require('mongodb');
// // const {static} = require("express");
// // const getDb = require('../util/database').getDb;   // * not used for mongoose.  // facilitating the database connection, to access the db...
// // ==== * =============================== * * * ==================================== * ====
// class Product {
//     constructor(title, price, description, imageUrl, id, userId) {
//         // even if we are not passing id when creating new product,
//         // and we are not intended to do it, because mongoDb is doing it anyway, when creating new document,
//         // so down in the if statement, this._id is always being defined..
//         this.title = title;
//         this.price = price;
//         this.description = description;
//         this.imageUrl = imageUrl;
//         this.userId = userId;
//         // this._id = id;   now, after modifying the id in the controller, need to change the 'id' to mongodb.ObjectId(id)..
//         this._id = id ? new mongodb.ObjectId(id) : null ;    // This is a better approach...
//     }
//     save() {
//         const db = getDb();
//         let dbOp;
//         if (this._id) {
//             // updating the product
//             dbOp = db.collection('products')
//                 // .updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: this });    // there is also option to update many -> .updateMany();
//                 .updateOne({ _id: this._id }, { $set: this });
//         } else {                                      // we can also use the following code - { $set: { title: this.title, price: this.price ... } }
//             // inserting the product
//             dbOp = db.collection('products').insertOne(this);
//         }
//
//         //db.collection('products').insertMany([]);
//         //db.collection('products').insertOne({name: 'A Book', price: 12.99});
//                                             // { javascript object }
//         return dbOp
//             .then(result => {
//                 console.log('Result collection product insertion action : ', result);
//             })
//             .catch(err => {
//                 console.log('Error collection product insertion action : ', err);
//             });
//     }
//
//     static fetchAll() {
//         //return db.collection('products').find({title: 'A Book'});   -> example for the 'find' search attributes / parameters
//         const db = getDb();
//         return db
//             .collection('products')
//             .find()      // finding all products
//             .toArray()
//             .then(products => {
//                 console.log('fetched products: ', products);
//                 return products;
//             })
//             .catch(err => {
//                 console.log ('error fetching out all products ' , err);
//             });
//     }
//
//     static findById(prodId) {
//         const db = getDb(); // get access to the db connection we have.
//         return db
//             .collection('products')
//             // .find({_id: prodId})
//             .find({_id: new mongodb.ObjectId(prodId)})
//             .next()
//             .then(product => {
//                 console.log('retrieved product: ' , product);
//                 return product;
//             })
//             .catch(err => {
//                 console.log('error retrieving single product from Mongo-db: ', err);
//             });
//     }
//
//     static deleteById(prodId) {
//         const db = getDb();     // need access-connection to the db
//         return db
//             .collection('products')
//             .deleteOne({ _id: new mongodb.ObjectId(prodId) })
//             .then(result =>
//                 { console.log('Deleted! result: ', result);
//                 }
//             )
//             .catch(err =>
//                 { console.log('Error deleting a product: ', err);
//                 }
//             );
//     }
// }
// // Product Model Follows:
// /* ****  Using Sequelize ****
// const Product = sequelize.define('product', {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     title: Sequelize.STRING,
//     price: {
//         type: Sequelize.DOUBLE,
//         allowNull: false
//     },
//     imageUrl: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     description: {
//         type: Sequelize.STRING,
//         allowNull: false
//     }
// });
// * ****/
//
// module.exports = Product;