const express = require('express');
const router = express.Router();
const productController = require('../Controllers/productController');

router.post('/bulk-add', productController.bulkAddProducts);
router.get('/', productController.getAllProducts);

module.exports = router;
