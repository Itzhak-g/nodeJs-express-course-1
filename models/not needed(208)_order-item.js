const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const OrderItem = sequelize.define('orderItem', {
    id: {                       // orderItem Id
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    quantity: Sequelize.INTEGER
});         // no need to declare a product id (item..) or cart id. These are added by the association.

module.exports = OrderItem;