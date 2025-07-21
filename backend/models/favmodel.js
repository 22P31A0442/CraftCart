const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
    id: { type: String, required: true }, // product id
    title: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    userId: { type: String, required: true } // 👈 NEW: to link favorite to a user
});

module.exports = mongoose.model('Favorite', favoriteSchema);
