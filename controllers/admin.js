const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
    //console.log('1) In [/add-product] - - -');
    // res.send('<h2>The "Add Product" Page</h2><form action="/admin/add-product" method="POST"><input type="text" name="title"><button type="submit">Submit</button> </form>')
    // 'action', The url to which the request should be sent.
    // res.sendFile(path.join(__dirname, '..', 'views', 'add-product.html'));    replaced by the following line ->
    //  console.log('rootDir in /admin/add-product path: ' ,rootDir);
    //   res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
    res.render(
        'admin/edit-product',
        {
            pageTitle: 'Add Product',
            path: '/admin/add-product',     // can stay as is, needed only for highlighting certain items in navigation bar
            editing: false,
            formsCSS: true,     // can be omitted
            activeAddProduct: true,    // can be omitted
            productCSS: true      // can be omitted
        });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    //const product = new Product(req.body.title);   // from the form in add-product.ejs
    /* === due to start working with sequelize... :
     const product = new Product(null, title, imageUrl, description, price);
    product
        .save()
        .then(() => {
            res.redirect('/');
        })
        .catch(err => console.log(err)); */
    //   console.log('req.body : ' , req.body);
    //   console.log('req.body.title [admin.js]: ' , req.body.title);
    // next();
    req.user
        .createProduct({
            title: title,
            price:price,
            imageUrl: imageUrl,
            description: description
        })
        .then(result => {
            // console.log('result is: ',result);   (eliminating tons of rows  :)
            console.log('Product Created Successfully')
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log('error is: ',err);
        });
};

// *-*-*-*-*-*-*-*-*-*-*-*-*-*-
exports.getEditProduct = (req, res, next) => {       // getEditProduct => action name - That's NOT Correct !!!!!! Action name is the rout (path).
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    req.user.getProducts({where: {id: prodId} })   // retrieving 'prodId' products for a specific user...
 //   Product.findByPk(prodId)
        .then(products => {
            const product = products[0];
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {     // *** creating the ejs page with populated editable fields ***
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',     // can stay as is, needed only for highlighting certain items in navigation bar
                editing: editMode,
                product: product
                /*        formsCSS: true,     // can be omitted
                        activeAddProduct: true,    // can be omitted
                        productCSS: true      // can be omitted     */
            });
        })
        .catch(err => {
            console.log(err);
            res.redirect('/');
        });
};


// =*=*=*=*=*=*=*=*=*=* before - w/o promise (.then .catch) =*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*
  /*  Product.findByPk(prodId, product => {
        if (!product) {
            return res.redirect('/');
        }
        res.render('admin/edit-product', {     // *** creating the ejs page with populated editable fields ***
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',     // can stay as is, needed only for highlighting certain items in navigation bar
            editing: editMode,
            product: product
            /!*        formsCSS: true,     // can be omitted
                    activeAddProduct: true,    // can be omitted
                    productCSS: true      // can be omitted     *!/
        });
    });*/

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDesc = req.body.description;
    Product.findByPk(prodId)    // --- first promise
        .then(product => {
            product.title = updatedTitle;
            product.imageUrl = updatedImageUrl;
            product.price = updatedPrice;
            product.description = updatedDesc;
            return product.save();     // --- second promise ---. Method provided by Sequelize. Only this causes the updated record to be saved in the DB.
                // return the promise which is return by the save function.
        })
        .then(result => {       // handling any success responses from the save promise.
            console.log('PRODUCT UPDATED!');
        })
        .catch(err => console.log(err));    // will catch any errors for both promises

    /*const updatedProduct = new Product(
        prodId,
        updatedTitle,
        updatedImageUrl,
        updatedDesc,
        updatedPrice
    );
    updatedProduct.save(); */      // good to add a callback to make sure we are re-directing only in the case of no errors.
    res.redirect('/admin/products');  // In case the product looks to not being updated on the html screen (page),
        // we may need to move the 'redirect' instruction up, putting it inside the second '.then (result)' block, immediately following the: 'console.log('PRODUCT UPDATED!')'.
    // This is because the redirect takes place before the first promise (of saving the changes) is done.
    // This also means in case of an error, we never load a new page. Not the best user experience.
};

// * * * * * * * * * * * * * * * * * * * * * * * * * * *
exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;      // The product-id belongs to the current user-id being logged only...
    console.log('product id is: ', prodId);
    //Product.destroy({where: Id = prodId});    -> this is one option. the other one is:
    Product.findByPk(prodId)
        .then(product => {
            return product.destroy();
        })
        .then(result => {
            console.log('PRODUCT DESTROYED');
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
/*    Product.deleteById(prodId);       // good to add a callback to make sure we are re-directing only in the case of no errors.
    res.redirect('/admin/products');    // deleteById does not exist in the Sequelize world*/
};

exports.getProducts = (req, res, next) => {
//    Product.findAll()
    req.user
        .getProducts()
        .then(products => {
            res.render('admin/products.ejs', {  // path to the file that contains the ejs content    // likely not necessary to include the file name extension.
                prods: products,
                pageTitle: 'Admin Products',     // instead of docTitle..
                path: '/admin/products',        //  url address
            });
        })
        .catch(err => console.log(err));

    /*Product.fetchAll(products => {
        res.render('admin/products.ejs', {  // path to the file that contains the ejs content    // likely not necessary to include the file name extension.
            prods: products,
            pageTitle: 'Admin Products',     // instead of docTitle..
            path: '/admin/products',        //  url address
            //hasProducts: products.length > 0,       // The information will be provided by another source...
            //activeShop: true,
            //productCSS: true*!/
            // layout: false      ->  to use in case you don't want to use the default main layout
        });
    });*/
};