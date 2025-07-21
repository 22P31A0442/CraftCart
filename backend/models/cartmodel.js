const mongoose = require('mongoose');

const cartschema = new mongoose.Schema({
    id: { type: String, required: true }, // product id
    title: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    userId: { type: String, required: true } 
});

module.exports = mongoose.model('Cart', cartschema);
