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

    Product.create({
        title: title,
        price:price,
        imageUrl: imageUrl,
        description: description
    }).then(result => {
        // console.log('result is: ',result);   (eliminating tons of rows  :)
        console.log('Product Created Successfully')
    }).catch(err => {
        console.log('error is: ',err);
    });
};

// *-*-*-*-*-*-*-*-*-*-*-*-*-*-
exports.getEditProduct = (req, res, next) => {       // getEditProduct => action name
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findByPk(prodId, product => {
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
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDesc = req.body.description;
    const updatedProduct = new Product(
        prodId,
        updatedTitle,
        updatedImageUrl,
        updatedDesc,
        updatedPrice
    );
    updatedProduct.save();       // good to add a callback to make sure we are re-directing only in the case of no errors.
    res.redirect('/admin/products');
};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    console.log('product id is: ', prodId);
    Product.deleteById(prodId);       // good to add a callback to make sure we are re-directing only in the case of no errors.
    res.redirect('/admin/products');
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('admin/products.ejs', {  // path to the file that contains the ejs content    // likely not necessary to include the file name extension.
            prods: products,
            pageTitle: 'Admin Products',     // instead of docTitle..
            path: '/admin/products',        //  url address
            /*hasProducts: products.length > 0,       // The information will be provided by another source...
            activeShop: true,
            productCSS: true*/
            // layout: false      ->  to use in case you don't want to use the default main layout
        });
    });
}