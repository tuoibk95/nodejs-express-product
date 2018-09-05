var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.send('product home page');
})

// router.get('/About', function(req, res) {
//     res.send('About this product')
// })

module.exports = router;


var product = require('./product.js');

app.use('./product', product);