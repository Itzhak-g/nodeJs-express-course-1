// const http = require('http');  --->>> no need for that due to the 'app.listen(3002)' command.

const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
/* const db = require('./util/database');     // db is the pool that allows us to use a connection in it.  (now not in use..) */

const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');          // *** Cart package being imported
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();  // express is doing a lot of things for us...

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop.js');
const path = require("path");

/*db.execute('SELECT * FROM products')
    .then(result => {
        console.log(result[0], result[1]);
    })
    .catch(err => {
        console.log('error: ',err)
    });*/

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));       // static middleware, to enable access to the 'public' folder.

app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user;   // saving sequelize object with all its methods (find, create, destroy). not just the javascript object with its fields.
            next();
        })
        .catch(err => {console.log('error finding user on startup' , err)});
});

app.use('/admin', adminRoutes);       // not calling the function, but the object itself (without parentheses).
app.use(shopRoutes);

app.use(errorController.get404Page);

Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});  // on deletion of user, its products will be deleted as well.
                        // Will add a field of user-id to a Product record, specifying the user-id the Product 'belongs' to.
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);  // Will add a field of user-id to a cart record, specifying the user-id the cart belongs to.
Cart.belongsToMany(Product, {through: CartItem});   // each cart-item record includes both cart-id and product-id .
Product.belongsToMany(Cart, {through: CartItem});   //            ============ || ============
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {through: OrderItem} );
Product.belongsToMany(Order, {through: OrderItem});

sequelize
  //  .sync({force: true})
    .sync()
    .then(result => {                /////// (1)
        return User.findByPk(1);
        // console.log('result : ' ,result);
    })
    .then(user => {         /////// (2)
        if (!user) {
            return User.create({name: 'IShlomo', email: 'itzhakgolan2@gmail.com'});
        }
        return user;
    })
    .then(user => {         /////// (3)
        console.log('userObj = ', user)
        return user.createCart();   /// > creating the cart
    })
    .then(cart => {
        app.listen(3002);
    })
    .catch(err => {
        console.log('user-cart err = ', err);
    });

/* A model can be synchronized with the database by calling model.sync(options) , an asynchronous function (that returns a Promise).
With this call, Sequelize will automatically perform an SQL query to the database.
Note that this only changes the table in the database, not the model in the JavaScript side. */

/*
const server = http.createServer(app);  // 'app' can definitely serve as a valid request handler for us.
server.listen(3002);
*/
// using instead ->
// app.listen moved from here to line 39, to the promise - result portion.
