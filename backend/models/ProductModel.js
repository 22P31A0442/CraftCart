
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  imageUrl: String,
  link: String,
});


module.exports = mongoose.model('Product', productSchema, 'products');