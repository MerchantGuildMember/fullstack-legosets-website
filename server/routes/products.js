
const router = require(`express`).Router();
const createError = require('http-errors')
const productsModel = require('server/models/products.js');

router.get(`/products`, (req, res) => {
    productsModel.find()
        .then(products => {
            res.json(products)
        })
})

router.get("products/:id", (req, res) => {
    productsModel.findById(req.params.id)
        .then(product => {
            res.json(product)
        })
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

