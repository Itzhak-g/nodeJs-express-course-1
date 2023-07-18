exports.get404Page = (req, res, next) => {
    res.status(404).render(
        '404',
        {
            pageTitle: 'Page-Not-Found',
            path: '/error',                 // must be...
            formsCSS: true,                 // better to have it.
            productCSS: true,               // better to have it.
            activeAddProduct: false,        // probably not needed..
            activeShop: false               // probably not needed.
        });
};
