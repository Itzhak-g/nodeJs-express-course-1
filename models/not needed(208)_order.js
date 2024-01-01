const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const Order = sequelize.define('order', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
});         // no need to declare a product id (item..) or cart id. These are added by the association.

module.exports = Order;