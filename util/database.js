/*
/////////// - working against products-rev-1 db - prior to Sequelize ////////////
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'node-complete',
    password: 'iG2122c#Kuell'
});

module.exports = pool.promise();
*/
/*
////////  **** Working with Sequelize ****  ////////
const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'iG2122c#Kuell', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;        //database connection pool, like before (above..) .
*/
const mongodb = require('mongodb');   // gives us access to the mongo db package
const MongoClient = mongodb.MongoClient;

let _db;
const mongoConnect = callback => {
    MongoClient.connect(
        'mongodb+srv://ikagolan7:fsZFOusPxcwKCXDN@cluster0.kctowmr.mongodb.net/shop?retryWrites=true&w=majority')
        .then(client => {
            console.log('Mongo Connection Status: Connected!!!');
            //callback(client);
            _db = client.db();
            callback();
        })
        .catch(err => {
            console.log('error trying to connect to Mongo DB - ', err);
            throw err;
        });
};

const getDb = () => {
    if (_db) {
        return _db;    // return access to the db - the db instance we connected to...  _db saves the access to the db.
    }
    throw 'No db found!'
};

// module.exports = mongoConnect;
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
