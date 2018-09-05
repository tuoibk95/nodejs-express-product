const Product = require('../models/product');
// const Genre = require('../models/product');

const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

const async = require('async');

exports.index = function(req, res) {
    async.parallel({
        product_count: function(callback) {
            Product.count({}, callback); // Pass an empty object as match condition to find all documents of this collection
        },
        product_available_count: function(callback) {
            Product.count({ status: 'Available' }, callback);
        },
    }, function(err, results) {
        res.render('index', { title: 'Local Library Home', error: err, data: results });
    });
};

// Display list of all products.
exports.product_list = function(req, res, next) {
    Product.find({}, 'image title star vote genre summary instock price')
        .populate('product')
        .exec(function(err, list_products) {
            if (err) { return next(err); }
            //Successful, so render
            // res.render('product_list', { title: 'Product List', product_list: list_products });
            //hien thi API JSON 
            res.send(JSON.stringify(list_products, null, 2));
        });
};
// Display detail page for a specific product.
exports.product_detail = function(req, res, next) {
    async.parallel({
        product: function(callback) {
            Product.find({ 'book': req.params.id })
                .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.product == null) { // No results.
            var err = new Error('product not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('product_detail', { title: 'Title', product: results.product });
    });
};
// Display product create form on GET.
exports.product_create_get = function(req, res, next) {
    // Get all authors and genres, which we can use for adding to our product.
    async.parallel({
        products: function(callback) {
            Product.find(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        res.render('product_form', { title: 'Create product', products: results.products });
    });

};

// Handle product create on POST.
exports.product_create_post = [
    // Convert the genre to an array.
    (req, res, next) => {
        if (!(req.body.product instanceof Array)) {
            if (typeof req.body.product === 'undefined')
                req.body.product = [];
            else
                req.body.product = new Array(req.body.product);
        }
        next();
    },

    // Validate fields.
    body('title', 'Title must not be empty.').isLength({ min: 1 }).trim(),
    body('summary', 'Summary must not be empty.').isLength({ min: 1 }).trim(),
    body('price', 'Price must not be empty').isLength({ min: 1 }).trim(),
    body('image', 'Image must not be empty').isLength({ min: 1 }).trim(),
    body('star', 'Star must not be empty').isLength({ min: 1 }).trim(),
    body('vote', 'Vote must not be empty').isLength({ min: 1 }).trim(),

    // Sanitize fields (using wildcard).
    sanitizeBody('.*').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a product object with escaped and trimmed data.
        const product = new Product({
            image: req.body.image,
            title: req.body.title,
            summary: req.body.summary,
            star: req.body.star,
            vote: req.body.vote,
            price: req.body.price,
            instock: req.body.instock,
            genre: req.body.genre
        });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all genres for form.
            async.parallel({
                genres: function(callback) {
                    Product.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                // Mark our selected genres as checked.
                for (let i = 0; i < results.genres.length; i++) {
                    if (product.genre.indexOf(results.genres[i]._id) > -1) {
                        results.genres[i].checked = 'true';
                    }
                }
                res.render('product_form', { title: 'Create product', product: product, errors: errors.array() });
            });
            return;
        } else {
            // Data from form is valid. Save product.
            product.save(function(err) {
                if (err) { return next(err); }
                //successful - redirect to new product record.
                res.redirect(product.url);
            });
        }
    }
];

// Display product delete form on GET.
exports.product_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: product delete GET');
};

// Handle product delete on POST.
exports.product_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: product delete POST');
};

// Display product update form on GET.
exports.product_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: product update GET');
};

// Handle product update on POST.
exports.product_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: product update POST');
};