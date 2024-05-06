const express = require('express');
const router = express.Router();
const catchAsync = require('../core/catchAsync');
const { isLoggedIn, isProductAuthor } = require('../middleware/auth');
const productController = require('../controllers/productController');

router.route('/products')
    .get(catchAsync(productController.getAllProducts))
    .post(isLoggedIn, catchAsync(productController.createNewProduct));

router.get('/products/new',isLoggedIn, productController.getNewProductsPage);

router.get('/products/:id/edit',isLoggedIn, catchAsync(productController.showEditPage));

router.route('/products/:id')
    .get(catchAsync(productController.showProduct))
    .patch(isLoggedIn, isProductAuthor, catchAsync(productController.updateProduct))
    .delete(isLoggedIn, catchAsync(productController.deleteProduct));


module.exports = router;

