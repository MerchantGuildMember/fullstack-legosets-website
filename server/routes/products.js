
const router = require(`express`).Router();
const createError = require('http-errors')
const productsModel = require('../models/products.js');
const QUERY_LIMIT = process.env.MAX_LIMIT_PER_QUERY

router.get(`/products`, (req, res) => {
    const page = parseInt(req.query.page, 10) || 0;
    const limit = Math.min(parseInt(req.query.limit, 10) || QUERY_LIMIT, 100);
    const skip = page * limit;

    // sort by _id so skip/limit paging is stable across requests
    productsModel.find().sort({ _id: 1 }).skip(skip).limit(limit + 1)
        .then(docs => {
            const hasMore = docs.length > limit;
            res.json({ products: docs.slice(0, limit), hasMore });
        })
        .catch(err => res.status(500).json({ error: "Failed to load products" }));
})

router.get("/products/:id", (req, res) => {
    productsModel.findById(req.params.id)
        .then(product => res.json(product))
        .catch(err => res.status(500).json({ error: "Failed to load product" }));
})

router.get("/products/search/:string", (req, res) => {
    const search = req.params.string;
    const page = parseInt(req.query.page, 10) || 0;
    const limit = Math.min(parseInt(req.query.limit, 10) || QUERY_LIMIT, 100);
    const skip = page * limit;

    productsModel.find({ name: { $regex: search, $options: 'i' } })
        .sort({ _id: 1 })
        .skip(skip)
        .limit(limit + 1)
        .then(docs => {
            const hasMore = docs.length > limit;
            res.json({ products: docs.slice(0, limit), hasMore });
        })
        .catch(err => res.status(500).json({ error: "Failed to load products" }));
})

router.post(`/product`, (req, res) => {
    productsModel.create(req.body)
        .then(product => {
            res.json(product)
        })
})

router.put(`/product/:id`, (req, res) => {
    productsModel.findByIdAndUpdate(req.params.id, {$set: req.body})
        .then(product => {
            res.json(product)
        })
})

router.delete(`/product/:id`, (req, res) => {
    productsModel.delete(req.params.id)
        .then(product => {
            res.json(product)
        })
})

module.exports = router;

