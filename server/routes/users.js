
const router = require(`express`).Router();
const createError = require('http-errors')
const usersModel = require('server/models/users.js');

router.get(`/users`, (req, res) => {
    usersModel.find()
        .then(users => {
            res.json(users)
        })
})

router.get("users/:id", (req, res) => {
    usersModel.findById(req.params.id)
        .then(user => {
            res.json(user)
        })
})

router.post(`/user`, (req, res) => {
    usersModel.create(req.body)
    .then(user => {
        res.json(user)
    })
})

router.put(`/user/:id`, (req, res) => {
    usersModel.findByIdAndUpdate(req.params.id, {$set: req.body})
    .then(user => {
        res.json(user)
    })
})

router.delete(`/user/:id`, (req, res) => {
    usersModel.delete(req.params.id)
        .then(user => {
            res.json(user)
        })
})

module.exports = router;

