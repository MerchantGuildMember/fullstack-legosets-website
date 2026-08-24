const router = require(`express`).Router();
const createError = require('http-errors')
const productsModel = require('../models/products.js');
const authenticate = require('../middleware/authenticate');
const requireAdmin = require('../middleware/requireAdmin');
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

function validateProductBody(body, { partial = false } = {}) {
    const errors = {};
    const clean = {};

    if (!partial || body.name !== undefined) {
        const name = typeof body.name === 'string' ? body.name.trim() : '';
        if (!name) errors.name = 'Name is required';
        else clean.name = name;
    }

    if (!partial || body.brand !== undefined) {
        const brand = typeof body.brand === 'string' ? body.brand.trim() : '';
        if (!brand) errors.brand = 'Brand is required';
        else clean.brand = brand;
    }

    if (!partial || body.price !== undefined) {
        const price = parseFloat(body.price);
        if (Number.isNaN(price) || price < 0) errors.price = 'Price must be a positive number';
        else clean.price = price;
    }

    if (!partial || body.stock !== undefined) {
        const stock = parseInt(body.stock, 10);
        if (Number.isNaN(stock) || stock < 0) errors.stock = 'Stock must be a non-negative whole number';
        else clean.stock = stock;
    }

    if (!partial || body.pieceCount !== undefined) {
        if (body.pieceCount !== undefined && body.pieceCount !== '') {
            const pieceCount = parseInt(body.pieceCount, 10);
            if (Number.isNaN(pieceCount) || pieceCount < 0) errors.pieceCount = 'Piece count must be a non-negative whole number';
            else clean.pieceCount = pieceCount;
        }
    }

    if (!partial || body.images !== undefined) {
        const images = Array.isArray(body.images) ? body.images.filter(Boolean) : [];
        if (images.length === 0) errors.images = 'At least one image URL is required';
        else clean.images = images;
    }

    if (body.description !== undefined) {
        clean.description = typeof body.description === 'string' ? body.description.trim() : '';
    }

    return { errors, clean };
}

router.get(`/products/brands`, (req, res, next) => {
    productsModel.distinct('brand')
        .then(brands => res.json({ brands: brands.filter(Boolean).sort() }))
        .catch(err => next(err));
})

router.get(`/products`, (req, res, next) => {
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
        .catch(err => next(err));
})

router.get("/products/:id", (req, res, next) => {
    productsModel.findById(req.params.id)
        .then(product => {
            if (!product) return next(createError(404, 'Product not found'));
            res.json(product)
        })
        .catch(err => next(err));
})

router.get("/products/search/:string", (req, res, next) => {
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
        .catch(err => next(err));
})

router.post(`/product`, authenticate, requireAdmin, (req, res, next) => {
    const { errors, clean } = validateProductBody(req.body);
    if (Object.keys(errors).length) {
        return next(createError(400, JSON.stringify(errors)));
    }

    productsModel.create(clean)
        .then(product => res.json(product))
        .catch(err => next(createError(500, 'Failed to create product')))
})

router.put(`/product/:id`, authenticate, requireAdmin, (req, res, next) => {
    const { errors, clean } = validateProductBody(req.body, { partial: true });
    if (Object.keys(errors).length) {
        return next(createError(400, JSON.stringify(errors)));
    }

    productsModel.findByIdAndUpdate(req.params.id, { $set: clean }, { new: true })
        .then(product => {
            if (!product) return next(createError(404, 'Product not found'));
            res.json(product)
        })
        .catch(err => next(createError(500, 'Failed to update product')))
})

router.delete(`/product/:id`, authenticate, requireAdmin, (req, res, next) => {
    productsModel.findByIdAndDelete(req.params.id)
        .then(product => {
            if (!product) return next(createError(404, 'Product not found'));
            res.json({ message: 'Product deleted' })
        })
        .catch(err => next(createError(500, 'Failed to delete product')))
})

module.exports = router;