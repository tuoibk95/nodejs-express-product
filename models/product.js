var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ProductSchema = new Schema({
    image: { type: String, required: true },
    title: { type: String, required: true },
    summary: { type: String, required: true },
    star: { type: String, required: true },
    vote: { type: String, required: true },
    price: { type: String, required: true },
    // genre: [{ type: Schema.ObjectId, required:true }],
    instock: { type: String, required: true },
    genre: { type: String, required: true }
});

ProductSchema
    .virtual('url')
    .get(function() {
        return '/catalog/product/' + this._id;
    });

module.exports = mongoose.model('Product', ProductSchema);