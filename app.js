// const http = require('http');  --->>> no need for that due to the 'app.listen(3002)' command.
const path = require("path");    // likely we don't need this line.

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
/* const db = require('./util/database');     // db is the pool that allows us to use a connection in it.  (now not in use..) */

// const mongoConnect = require('./util/database').mongoConnect;    // * 'database' not used when working with mongoose.
const User = require('./models/user');      // temporarily commented out 4 mongoose...

/****** Start working with NoSQL Mongo DB -> we don't need for all dependencies we needed when working with SQL and Sequelize ******
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');          // *** Cart package being imported
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');
*/

const app = express();  // express is doing a lot of things for us...

app.set('view engine', 'ejs');
app.set('views', 'views');


const adminRoutes = require('./routes/admin')    // ***
const shopRoutes = require('./routes/shop.js');

/*db.execute('SELECT * FROM products')
    .then(result => {
        console.log(result[0], result[1]);
    })
    .catch(err => {
        console.log('error: ',err)
    });*/

app.use(bodyParser.urlencoded({extended: false}));      // The body-parser package is used to get data from the request body in an Express server
app.use(express.static(path.join(__dirname, 'public')));       // static middleware, to enable access to the 'public' folder.

// Temporarily commented out 4 mongoose ---
app.use((req, res, next) => {
  // ---- Instructor also commented out following lines related to finding User by id (Pk) - now comment them back in them. ----
    // User.findByPk(1)    // used when working with sequelize or with mySQL.
    // User.findById('65397d9a40ce5cdc7803bdba')
    // User.findById('655261a874c7325478c4c0de')
    User.findById('657f29b190b7204d1e6d402f')     // ('656f5727c11e774a0316eed9')
        .then(user => {
            // req.user = user;   // This includes saving object's properties only. Because we are getting the user object from the DB.
                              // [Not necessarily true in the case of Sequelize..]
            req.user = user; // * new User(user.name, user.email, user.cart, user._id); *  // user._id is copied from the db. * Not in use with mongoose *
                              // This is - user - a full mongoose object, including functions and methods.
            next();
        })
        .catch(err => {console.log('error finding user on startup ' , err)});
    // next();    >>> duplicate! should be removed..
});

app.use('/admin', adminRoutes);       // *** not calling the function, but the object itself (without parentheses).
app.use(shopRoutes);


app.use(errorController.get404Page);

// mongoConnect((client) => {    // a function that will get executed once we connect it
//   we don't get the 'client' here, since the mongoConnect function in database.js file, does not send it anymore.

/*
mongoConnect(() => {        // * not used when working with mongoose.
    // console.log(client);
        app.listen(3002);
});
*/

mongoose
    .connect('mongodb+srv://ikagolan7:fsZFOusPxcwKCXDN@cluster0.kctowmr.mongodb.net/shop?retryWrites=true&w=majority')
    .then(result => {
        User.findOne().then(user => {
            if (!user) {
                console.log('mongoose creating new user - result: ', result);
                const user = new User({
                    name: 'Itzhak-Golan',            // 'Itzhak',
                    email: 'ikagolan7@gmail.com',       // 'itzhakgolan2@gmail.com',
                    cart: {
                        items: []
                    }
                });
                user.save();
            }
        });
        app.listen(3002);
    })
    .catch(err => {
        console.log('Error connecting to mongoDB using mongoose: ', err);
    });

/*
**** Following lines have been removed after switching to work with NoSQL Mongo DB ****
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
            return User.create({name: 'IShlomo', email: 'itzhakgolan2@gmail.com'});   ****************
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
*/

/* A model can be synchronized with the database by calling model.sync(options) , an asynchronous function (that returns a Promise).
With this call, Sequelize will automatically perform an SQL query to the database.
Note that this only changes the table in the database, not the model in the JavaScript side. */

/*
const server = http.createServer(app);  // 'app' can definitely serve as a valid request handler for us.
server.listen(3002);
*/
// using instead ->
// app.listen moved from here to line 39, to the promise - result portion.

