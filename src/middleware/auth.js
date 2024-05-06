const catchAsync = require("../core/catchAsync");
const Product = require('../models/Product');

const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'Please login to continue');
        return res.redirect('/login');
    }
    return next();
}

const isProductAuthor = catchAsync(async (req, res, next) => {
    const { id: productId } = req.params;
    const product = await Product.findById(productId);
    const currentUserId = req.user._id;
    //We can improve the below code using mongoose instance methods.
    if (!product.author || !product.author.equals(currentUserId)) {
        req.flash('error', 'You dont have permission to do that!');
        return res.redirect(`/products/${productId}`);
    }
    return next();
});

module.exports = {
    isLoggedIn,
    isProductAuthor
}