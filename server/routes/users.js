
const router = require(`express`).Router();
const createError = require('http-errors')
const usersModel = require('../models/users.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const authenticate = require('../middleware/authenticate')

router.post('/users/register', (req, res, next) => {
    const { name, email, password } = req.body

    usersModel.findOne({ email })
        .then(uniqueData => {
            if (uniqueData) {
                next(createError(403, `User already exists`))
            } else {
                bcrypt.hash(password, parseInt(process.env.PASSWORD_SALT_ROUNDS), (err, hash) => {
                    usersModel.create({ name, email, password: hash })
                        .then(data => {
                            const token = jwt.sign(
                                {
                                    email: data.email,
                                    accessLevel: data.accessLevel,
                                    userId: data._id    // <-- add this
                                },
                                process.env.JWT_ACCESS_TOKEN_SECRET,
                                { algorithm: 'HS256', expiresIn: process.env.JWT_EXPIRY }
                            )
                            res.json({ name: data.name, accessLevel: data.accessLevel, token })
                        })
                        .catch(err => next(createError(409, `User was not registered`)))
                })
            }
        })
        .catch(err => next(err))
})

router.post(`/users/login`, (req, res, next) =>
{
    const { email, password } = req.body

    usersModel.findOne({email})
        .then(data => {
            bcrypt.compare(password, data.password, (err, result) => {
                if(result) {
                    const token = jwt.sign(
                        {
                            email: data.email,
                            accessLevel: data.accessLevel,
                            userId: data._id    // <-- add this
                        },
                        process.env.JWT_ACCESS_TOKEN_SECRET,
                        { algorithm: 'HS256', expiresIn: process.env.JWT_EXPIRY }
                    )
                    res.json({ name: data.name, accessLevel: data.accessLevel, token })
                } else {
                    next(createError(403, `User is not logged in`))
                }
            })
        })
        .catch(err => next(createError(403, `User is not logged in`)))
})


router.post(`/users/logout`, (req, res, next) =>
{
    res.json({})
})

router.get(`/users`, (req, res) => {
    usersModel.find()
        .then(users => {
            res.json(users)
        })
})

router.get('/users/me', authenticate, (req, res, next) => {
    usersModel.findOne({ email: req.user.email })
        .then(data => {
            if (!data) return next(createError(404, 'User not found'))
            res.json({
                name: data.name,
                email: data.email,
                photo: data.photo,
                accessLevel: data.accessLevel
            })
        })
        .catch(err => next(err))
})

router.get('/users/verify', authenticate, (req, res, next) => {
    res.json({ isLoggedIn: true })
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

