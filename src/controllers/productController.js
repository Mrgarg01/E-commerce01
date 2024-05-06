const Product = require('../models/Product');
const { BadRequestError } = require('../core/ApiError');

const getAllProducts = async (req, res) => {
    const products = await Product.find({});
    res.render('products/index', { products });
}

const getNewProductsPage = (req, res) => {
    res.render('products/new');
}

const createNewProduct = async (req, res) => {
    const { name, imageUrl, desc, price } = req.body;
    const currentUser = req.user;
    await Product.create({ name, imageUrl, desc, price, author: currentUser._id });
    res.redirect('/products');
}

const showProduct = async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id)
        .populate('reviews');
    if (!product) {
        throw new BadRequestError(`Product with this id: ${id} doesn't exists.`);
    }
    res.render('products/show', { product });
}

const showEditPage = async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
        throw new BadRequestError(`Product with this id: ${id} doesn't exists.`);
    }
    res.render('products/edit', { product });
}

const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, price, desc, imageUrl } = req.body;
    await Product.findByIdAndUpdate(id, { name, price, desc, imageUrl });
    res.redirect(`/products/${id}`);
}

const deleteProduct = async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect('/products');
}

module.exports = {
    getAllProducts,
    getNewProductsPage,
    createNewProduct,
    showProduct,
    showEditPage,
    updateProduct,
    deleteProduct
}