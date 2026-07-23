const router = require(`express`).Router();
const createError = require('http-errors')
const productsModel = require('../models/products.js');
const QUERY_LIMIT = process.env.MAX_LIMIT_PER_QUERY

const SORT_OPTIONS = {
    relevance: { _id: 1 },
    newest: { createdAt: -1, _id: 1 },
    oldest: { createdAt: 1, _id: 1 },
    price_asc: { price: 1, _id: 1 },
    price_desc: { price: -1, _id: 1 },
    name_asc: { name: 1, _id: 1 },
    name_desc: { name: -1, _id: 1 },
    popular: { ratingCount: -1, _id: 1 },
};

function getSort(sortParam) {
    return SORT_OPTIONS[sortParam] || SORT_OPTIONS.relevance;
}

function getFilter(query) {
    const filter = {};

    if (query.brand) {
        const brands = String(query.brand)
            .split(',')
            .map(b => b.trim())
            .filter(Boolean);
        if (brands.length) filter.brand = { $in: brands };
    }

    const minPrice = parseFloat(query.minPrice);
    const maxPrice = parseFloat(query.maxPrice);
    if (!Number.isNaN(minPrice) || !Number.isNaN(maxPrice)) {
        filter.price = {};
        if (!Number.isNaN(minPrice)) filter.price.$gte = minPrice;
        if (!Number.isNaN(maxPrice)) filter.price.$lte = maxPrice;
    }

    const minPieces = parseInt(query.minPieces, 10);
    const maxPieces = parseInt(query.maxPieces, 10);
    if (!Number.isNaN(minPieces) || !Number.isNaN(maxPieces)) {
        filter.pieceCount = {};
        if (!Number.isNaN(minPieces)) filter.pieceCount.$gte = minPieces;
        if (!Number.isNaN(maxPieces)) filter.pieceCount.$lte = maxPieces;
    }

    if (query.inStock === 'true') {
        filter.stock = { $gt: 0 };
    }

    return filter;
}

router.get(`/products/brands`, (req, res) => {
    productsModel.distinct('brand')
        .then(brands => res.json({ brands: brands.filter(Boolean).sort() }))
        .catch(err => res.status(500).json({ error: "Failed to load brands" }));
})

router.get(`/products`, (req, res) => {
    const page = parseInt(req.query.page, 10) || 0;
    const limit = Math.min(parseInt(req.query.limit, 10) || QUERY_LIMIT, 100);
    const skip = page * limit;
    const sort = getSort(req.query.sort);
    const filter = getFilter(req.query);

    productsModel.find(filter).sort(sort).skip(skip).limit(limit + 1)
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
    const sort = getSort(req.query.sort);
    const filter = { ...getFilter(req.query), name: { $regex: search, $options: 'i' } };

    productsModel.find(filter)
        .sort(sort)
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