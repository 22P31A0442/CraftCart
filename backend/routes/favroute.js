
const express = require('express');
const router = express.Router();
const Favorite = require('../models/favmodel');


router.get('/:userId', async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.params.userId });
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});
router.post('/', async (req, res) => {
    try {
        const { id, title, price, image, userId } = req.body;

        
        const existing = await Favorite.findOne({ id, userId });
        if (existing) return res.status(200).json({ message: "Already exists" });

        const favorite = new Favorite({ id, title, price, image, userId });
        await favorite.save();
        res.status(201).json(favorite);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.delete('/:userId/:itemId', async (req, res) => {
  try {
    await Favorite.deleteOne({ userId: req.params.userId, id: req.params.itemId });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Could not remove favorite." });
  }
});


module.exports = router;
