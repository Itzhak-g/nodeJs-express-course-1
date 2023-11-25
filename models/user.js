// const Sequelize = require('sequelize');          **** sequelize ****
// const sequelize = require('../util/database');           **** sequelize ****

// User Model Follows:
// const User = sequelize.define('user', {         **** sequelize ****
//    id: {                       // userId         **** sequelize ****
//        type: Sequelize.INTEGER,                    **** sequelize ****
//        autoIncrement: true,                        **** sequelize ****
//        allowNull: false,                           **** sequelize ****
//        primaryKey: true                            **** sequelize ****
//    },                                              **** sequelize ****
//    name: Sequelize.STRING,                             **** sequelize ****
    /*price: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },*/
    /*email: {
        type: Sequelize.STRING,     // DataTypes.STRING
        allowNull: false,         // ?
        validate: {
            isEmail: {
                msg: "Must be a valid email address"
            }
        }
    }*/
//    email: Sequelize.STRING                             **** sequelize ****
    /*,
    description: {
        type: Sequelize.STRING,
        allowNull: false
    }*/
// });                                                    **** sequelize ****
// module.exports = User;                                 **** sequelize ****
const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;    // importing MongoDB client

const ObjectId = mongodb.ObjectId;          // store access by reference, to the objectId class by ObjectId constant
class User {   // ***   This file is dealing with 'Users' as well as with 'Carts' ***
    constructor(username, email, cart, id) {
        this.name = username;
        this.email = email;
        this.cart = cart;       // {items [];}
        this._id = id;
    }
    save() {
        const db = getDb();
/*      let dbOp;
                ----- This is what I was trying to do -----
        dbOp = db.collection('users').insertOne(this);
        return dbOp
            .then(result => {
                console.log('result-Successful user insertion action : ', result);
            })
            .catch(err => {
                console.log('Error saving user:' , err);
            })
*/
        return db.collection('users').insertOne(this);   // saving user info to the Mongo DB
    }

    addToCart(product) {    //***
        const cartProductIndex = this.cart.items.findIndex(cp => {      // cp > = product-id of products on the items array on 'cart' DB server
            return cp.productId.toString() === product._id.toString();
         // 'cp.productId' - represents cart current productId's we are scanning <=> product._id - id of a 'products' collection product we are trying to add to the cart.
        });
        let newQuantity = 1;    // by default .... (?)
        const updatedCartItems = [...this.cart.items];

        if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        } else {
            updatedCartItems.push({
                productId: new ObjectId(product._id),      // structuring the cart first record..
                quantity: newQuantity
            });
        }
        // product.quantity = 1;
        // const updatedCart = { items: [ { ...product, quantity: 1 } ] };  // actually we don't want to save all the data -
        // ------------------------------------------------                 // but the product._id and quantity.
        const updatedCart = {
         //   items: [{ productId: new ObjectId(product._id), quantity: newQuantity}]     // before .....
            items: updatedCartItems
        };
        const db = getDb();
        return db
            .collection('users')
            .updateOne(
            { _id: new ObjectId(this._id) },    // seeking the appropriate user id.
            { $set: { cart: updatedCart } }    // overriding the appropriate field.
        );
    }    // ***

    getCart() {
        // return this.cart;
        const db = getDb();
        const productsIds = this.cart.items.map(i => {   // 1) Iterates over cart items. 2) Besides quantity, Carts hold products_id only - NOT products description.
            return i.productId;     // i => cart items... productIds now comprise array, containing all cart products id's of a specific user (cart).
        });
        return db
            .collection('products')     // products collection
            .find({_id: { $in: productsIds } })    // filtering the products_Id's list to user products_Id's only
            .toArray()  // array of product id's from products collection found similar to cart productId's
            .then(products => {     // fresh (fetched) products from 'products' db collection
                return products.map(p => {      // transformation by using map js function (products collection).
                    return {
                        ...p,   // products all properties - 'quantity' is not part of 'products' collection.
                        quantity: this.cart.items.find( i => {    // i => iterating cart items in 'users' collection.
                            return i.productId.toString() === p._id.toString();   // gives us product(s) object(s)
                               // 'users' cart products_id's <=> products id's just fetched from the 'products collection' db
                        }).quantity // .quantity extracted from product object in: Users collection - Cart/items/productId + quantity
                    }                                                         //  ================   ================================
                })
                //this.cart.items.map(p => {
                //return ...p
            });
    };

    deleteItemFromCart(productId) {
        //const updatedCartItems = [...this.cart.items];  a better way is in the following line - -
        const updatedCartItems = this.cart.items.filter(item => {
            return item.productId.toString() !== productId.toString();  // return all cart.items pending the strict equality comparison === gives true.
        })
        const db = getDb();
        return db
            .collection('users')
            .updateOne(
                { _id: new ObjectId(this._id) },    // seeking the appropriate user id.
                { $set: { cart: { items: updatedCartItems } } }    // overriding the appropriate field.
            );
    }

    static findById(userId) {
        const db = getDb();
        /*  return db.collection('users').find({ _id: new ObjectId(userId) })
            .next()  */
        // Alternative way achieving the same target is shown below -
        return db
            .collection('users')
            .findOne({ _id: new ObjectId(userId) })
            .then(user => {
                console.log('Retrieved user_id: ', user);
                return user;
            })
            .catch(err => {
                console.log('Error finding user: ', err);
            });

    };
}   // ***

module.exports = User;