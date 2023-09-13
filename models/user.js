const Sequelize = require('sequelize');

const sequelize = require('../util/database');

// User Model Follows:
const User = sequelize.define('user', {
    id: {                       // userId
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: Sequelize.STRING,
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
    email: Sequelize.STRING
    /*,
    description: {
        type: Sequelize.STRING,
        allowNull: false
    }*/
});

module.exports = User;