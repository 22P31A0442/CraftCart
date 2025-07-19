// models/ProductModel.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  imageUrl: String,
  link: String,
});

// Pass the collection name as the third argument
module.exports = mongoose.model('Product', productSchema, 'products');