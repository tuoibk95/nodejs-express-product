var express = require('express');
var router = express.Router();

var product_controller = require('../controllers/productController');

router.get('/', product_controller.index);

router.get('/product/list', product_controller.product_list);

router.get('/product/create', product_controller.product_create_get);

router.post('/product/create', product_controller.product_create_post);

router.get('/product/:id/delete', product_controller.product_delete_get);

// POST request to delete Product.
router.post('/product/:id/delete', product_controller.product_delete_post);

// GET request to update Product.
router.get('/product/:id/update', product_controller.product_update_get);

// POST request to update Product.
router.post('/product/:id/update', product_controller.product_update_post);

// GET request for one Product.
router.get('/product/:id', product_controller.product_detail);

// GET request for list of all Product items.
router.get('/products/', product_controller.product_list);

module.exports = router;
