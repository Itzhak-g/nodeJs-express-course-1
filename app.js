// const http = require('http');  --->>> no need for that due to the 'app.listen(3002)' command.

const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
const db = require('./util/database');     // db is the pool that allows us to use a connection in it

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

app.use('/admin', adminRoutes);       // not calling the function, but the object itself (without parentheses).
app.use(shopRoutes);

app.use(errorController.get404Page);

/*
const server = http.createServer(app);  // 'app' can definitely serve as a valid request handler for us.
server.listen(3002);
*/
// using instead ->
app.listen(3002);
