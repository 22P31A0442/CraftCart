
const express = require('express');
const router = express.Router();
const Cart = require('../models/cartmodel'); 


router.get('/:userId', async (req, res) => {
  try {
    const cart = await Cart.find({ userId: req.params.userId });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

router.post("/", async (req, res) => {
  const { id, title, price, image, userId } = req.body;
  try {
    const existingItem = await Cart.findOne({ userId, id });
    if (existingItem) {
      return res.json({ message: "Already exists" });
    }
    const cartItem = new Cart({ id, title, price, image, userId });
    await cartItem.save();
    res.json({ success: true, item: cartItem }); 
  } catch (err) {
    console.error("Cart POST error:", err);
    res.status(500).json({ error: "Could not add to cart." });
  }
});



router.delete('/:userId/:itemId', async (req, res) => {
  console.log("🔥 Delete route hit with:", req.params);
  try {
    const result = await Cart.deleteOne({ userId: req.params.userId, id: req.params.itemId });
    console.log("🧹 Deletion result:", result);
    res.json({ success: result.deletedCount > 0 });
  } catch (err) {
    console.error("❌ Error in deleting cart item:", err);
    res.status(500).json({ error: "Could not remove cart item." });
  }
});


module.exports = router;
