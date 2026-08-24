const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const Cart = require('../models/cart');
const Product = require('../models/products');
const { publicKey } = require('../config/keys');

function identifyCart(req, res, next) {
    let user = null;
    let guest = null;

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (token && token !== 'null') {
        try {
            const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
            user = decoded.userId;
        } catch (err) {
            return next(createError(401, 'Invalid token'));
        }
    } else {
        guest = req.headers['x-guest-id'];
        if (!guest) {
            return next(createError(400, 'Missing guest ID'));
        }
    }

    if (!user && !guest) {
        return next(createError(400, 'Invalid identification'));
    }

    req.cartFilter = user ? { user } : { guestId: guest };
    next();
}

router.get('/cart', identifyCart, async (req, res, next) => {
    try {
        const cart = await Cart.findOne(req.cartFilter).populate('items.product');
        if (!cart) return res.json({ items: [] });

        const items = cart.items
            .filter(i => i.product)
            .map(i => ({
                productId: i.product._id,
                title: i.product.name,
                price: i.product.price,
                image: i.product.images?.[0] || '',
                quantity: i.quantity
            }))

        res.json({ items });
    } catch (err) {
        next(err);
    }
});

router.post('/cart/add', identifyCart, async (req, res, next) => {
    const { productId, quantity = 1 } = req.body;
    try {
        const product = await Product.findById(productId);
        if (!product) return next(createError(404, 'Product not found'));

        let cart = await Cart.findOne(req.cartFilter);
        if (!cart) cart = new Cart({ ...req.cartFilter, items: [] });

        const existing = cart.items.find(i => i.product.toString() === productId);
        if (existing) {
            existing.quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        await cart.save();
        res.json({ message: 'Added to cart' });
    } catch (err) {
        next(err);
    }
});

router.put('/cart/:productId', identifyCart, async (req, res, next) => {
    try {
        const cart = await Cart.findOne(req.cartFilter);
        if (!cart) return next(createError(404, 'Cart not found'));

        const item = cart.items.find(i => i.product.toString() === req.params.productId);
        if (!item) return next(createError(404, 'Item not in cart'));

        item.quantity = req.body.quantity;
        await cart.save();
        res.json({ message: 'Updated' });
    } catch (err) {
        next(err);
    }
});

router.delete('/cart/:productId', identifyCart, async (req, res, next) => {
    try {
        const cart = await Cart.findOne(req.cartFilter);
        if (!cart) return next(createError(404, 'Cart not found'));

        cart.items = cart.items.filter(i => i.product.toString() !== req.params.productId);
        await cart.save();
        res.json({ message: 'Removed' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;