const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Cart = require('../models/cart');
const Product = require('../models/products');

function identifyCart(req, res, next) {
    let user = null;
    let guest = null;

    const authHeader = req.headers.authorization;
    if (authHeader) {
        try {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
            user = decoded.userId;
        } catch (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    } else {
        guest = req.headers['x-guest-id'];
        if (!guest) {
            return res.status(400).json({ message: 'Missing guest ID' });
        }
    }

    if (!user && !guest) {
        return res.status(400).json({ message: 'Invalid identification' });
    }

    req.cartFilter = user ? { user } : { guestId: guest };
    next();
}

router.get('/cart', identifyCart, async (req, res) => {
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
        res.status(500).json({ message: err.message });
    }
});

router.post('/cart/add', identifyCart, async (req, res) => {
    const { productId, quantity = 1 } = req.body;
    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

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
        res.status(500).json({ message: err.message });
    }
});

router.put('/cart/:productId', identifyCart, async (req, res) => {
    try {
        const cart = await Cart.findOne(req.cartFilter);
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const item = cart.items.find(i => i.product.toString() === req.params.productId);
        if (!item) return res.status(404).json({ message: 'Item not in cart' });

        item.quantity = req.body.quantity;
        await cart.save();
        res.json({ message: 'Updated' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/cart/:productId', identifyCart, async (req, res) => {
    try {
        const cart = await Cart.findOne(req.cartFilter);
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        cart.items = cart.items.filter(i => i.product.toString() !== req.params.productId);
        await cart.save();
        res.json({ message: 'Removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;