const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const Order = require('../models/orders');
const Cart = require('../models/cart');
const Product = require('../models/products');
const authenticate = require('../middleware/authenticate');
const requireAdmin = require('../middleware/requireAdmin');
const { publicKey } = require('../config/keys');

function identifyCustomer(req, res, next) {
    let user = null;
    let guest = null;

    const authHeader = req.headers.authorization;
    if (authHeader) {
        try {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
            user = decoded.userId;
        } catch (err) {
            return next(createError(401, 'Invalid token'));
        }
    } else {
        guest = req.headers['x-guest-id'];
        if (!guest) return next(createError(400, 'Missing guest ID'));
    }

    if (!user && !guest) return next(createError(400, 'Invalid identification'));

    req.customer = user ? { user } : { guest };
    next();
}

router.post('/checkout', identifyCustomer, async (req, res, next) => {
    const { address } = req.body;
    if (!address) return next(createError(400, 'Address is required'));

    try {
        const cartFilter = req.customer.user
            ? { user: req.customer.user }
            : { guestId: req.customer.guest };

        const cart = await Cart.findOne(cartFilter).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return next(createError(400, 'Cart is empty'));
        }

        for (const item of cart.items) {
            if (!item.product) return next(createError(400, 'A product in your cart no longer exists'));
            if (item.product.stock < item.quantity) {
                return next(createError(409, `Not enough stock for ${item.product.name}`));
            }
        }

        const orders = await Promise.all(cart.items.map(item => {
            return Order.create({
                userID: req.customer.user || null,
                guestId: req.customer.guest || null,
                productID: item.product._id,
                amount: item.quantity,
                address,
                total_price: item.product.price * item.quantity
            });
        }));

        await Promise.all(cart.items.map(item =>
            Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } })
        ));

        cart.items = [];
        await cart.save();

        const grandTotal = orders.reduce((sum, o) => sum + o.total_price, 0);
        res.json({ message: 'Order placed', orders, total: grandTotal });
    } catch (err) {
        next(err);
    }
});

router.get('/orders/mine', identifyCustomer, async (req, res, next) => {
    if (!req.customer.user) {
        return next(createError(401, 'Login required to view order history'));
    }

    try {
        const orders = await Order.find({ userID: req.customer.user })
            .sort({ createdAt: -1 })
            .populate('productID', 'name price image');

        res.json(orders);
    } catch (err) {
        next(err);
    }
});

router.post('/orders/:id/return', authenticate, async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return next(createError(404, 'Order not found'));

        if (!order.userID || order.userID.toString() !== req.user.userId) {
            return next(createError(403, 'You cannot return this order'));
        }

        if (order.status === 'returned') {
            return next(createError(409, 'Order has already been returned'));
        }

        order.status = 'returned';
        order.returnedAt = new Date();
        await order.save();

        await Product.findByIdAndUpdate(order.productID, { $inc: { stock: order.amount } });

        res.json(order);
    } catch (err) {
        next(err);
    }
});

router.get('/orders/user/:userId', authenticate, requireAdmin, async (req, res, next) => {
    try {
        const orders = await Order.find({ userID: req.params.userId })
            .sort({ createdAt: -1 })
            .populate('productID', 'name price images');

        res.json(orders);
    } catch (err) {
        next(err);
    }
});

module.exports = router;