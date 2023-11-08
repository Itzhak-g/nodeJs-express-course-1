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
class User {
    constructor(username, email) {
        this.name = username;
        this.email = email;
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
        return db.collection('users').insertOne(this);

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

    }
}

module.exports = User