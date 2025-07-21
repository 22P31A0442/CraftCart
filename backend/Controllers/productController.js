const Product = require('../models/ProductModel');

exports.bulkAddProducts = async (req, res) => {
  try {
    const products = req.body;
    const inserted = await Product.insertMany(products);
    res.status(201).json(inserted);
  } catch (error) {
    console.error("Error bulk adding products:", error);
    res.status(500).json({ message: "Bulk insert failed" });
  }
};



exports.getAllProducts = async (req, res) => {
  try {
    console.log("Backend: Attempting to fetch products from MongoDB...");
    const products = await Product.find();
    console.log("Backend: Products found:", products); 
    res.json(products);
  } catch (error) {
    console.error("Backend: Error fetching products from DB:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

