/*
/////////// - working against products-rev-1 db - ////////////
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'node-complete',
    password: 'iG2122c#Kuell'
});

module.exports = pool.promise();
*/

const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'iG2122c#Kuell', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;        //database connection pool, like before (above..) .
