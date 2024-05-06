const express = require('express');
const router = express.Router();
const User = require('../models/User');
const catchAsync = require('../core/catchAsync');
const passport = require('passport');
const Product = require('../models/Product');
const { isLoggedIn } = require('../middleware/auth');

// router.get('/fakeUser',async(req, res) => {
//     const user = new User({ username: 'Max', email: 'max@gmail.com' });
//     const fakeUser = await User.register(user, "1234");
//     res.send(fakeUser);
// });

router.get('/register', (req, res) => {
    res.render('users/signup');
});

router.post('/register',catchAsync(async(req, res) => {
    const { username, password, role, email } = req.body;
    const newUser = new User({ username, email, role });
    await User.register(newUser, password);
    res.redirect('/login');
}));

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
}), (req, res) => {
    req.flash('success', 'Welcome Back!');
    console.log('Inside login route');
    res.redirect('/products');
});

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            req.flash('error', 'Cannot logout at the moment!');
            return res.redirect('/products');
        }
        req.flash('success', 'Tata bye bye!');
        return res.redirect('/products');
    });
});

router.post('/cart/:productId', isLoggedIn, catchAsync(async (req, res) => {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    const currentUser = await User.findById(req.user._id);
    const existingCartItem = currentUser.cart.find((item) => item.productId.equals(product._id));
    if (existingCartItem) {
        existingCartItem.qty = existingCartItem.qty + 1;
    } else {
        currentUser.cart.push({ productId: product._id, name: product.name, price: product.price, imageUrl: product.imageUrl });
    }
    await currentUser.save();
    res.redirect(`/products/${productId}`);
}));

router.get('/cart',isLoggedIn, catchAsync(async(req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId);
    const totalCartAmount = user.cart.reduce((total, item) => total + item.price * item.qty, 0);
    res.render('users/cart', { totalCartAmount, cart: user.cart });
}));

module.exports = router;