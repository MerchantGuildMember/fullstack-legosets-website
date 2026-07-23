const router = require(`express`).Router();
const createError = require('http-errors')
const usersModel = require('../models/users.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const authenticate = require('../middleware/authenticate')
const { privateKey } = require('../config/keys')

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_PHOTO_BYTES = 5 * 1024 * 1024

const signToken = (user) => jwt.sign(
    { email: user.email, accessLevel: user.accessLevel, userId: user._id },
    privateKey,
    { algorithm: 'RS256', expiresIn: process.env.JWT_EXPIRY }
)

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
                            const token = signToken(data)
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
                    const token = signToken(data)
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

router.patch('/users/me', authenticate, (req, res, next) => {
    const { name, email, password, photo } = req.body

    if (name === undefined && email === undefined && password === undefined && photo === undefined) {
        return next(createError(400, 'No fields to update were provided'))
    }

    usersModel.findOne({ email: req.user.email })
        .then(user => {
            if (!user) return next(createError(404, 'User not found'))

            const updates = {}
            const tasks = []

            if (name !== undefined) {
                const trimmed = typeof name === 'string' ? name.trim() : ''
                if (trimmed.length < 2 || trimmed.length > 50) {
                    throw createError(400, 'Name must be between 2 and 50 characters')
                }
                updates.name = trimmed
            }

            if (photo !== undefined) {
                if (typeof photo !== 'string' || !photo.startsWith('data:image/')) {
                    throw createError(400, 'Photo must be a valid image')
                }
                const approxBytes = photo.length * 0.75
                if (approxBytes > MAX_PHOTO_BYTES) {
                    throw createError(400, 'Image must be smaller than 5MB')
                }
                updates.photo = photo
            }

            if (email !== undefined) {
                const trimmed = typeof email === 'string' ? email.trim().toLowerCase() : ''
                if (!EMAIL_REGEX.test(trimmed)) {
                    throw createError(400, 'Please enter a valid email address')
                }
                tasks.push(
                    usersModel.findOne({ email: trimmed })
                        .then(existing => {
                            if (existing && String(existing._id) !== String(user._id)) {
                                throw createError(409, 'That email is already in use')
                            }
                            updates.email = trimmed
                        })
                )
            }

            if (password !== undefined) {
                if (typeof password !== 'string' || password.length < 8 || password.length > 128) {
                    throw createError(400, 'Password must be between 8 and 128 characters')
                }
                tasks.push(
                    new Promise((resolve, reject) => {
                        bcrypt.hash(password, parseInt(process.env.PASSWORD_SALT_ROUNDS), (err, hash) => {
                            if (err) return reject(err)
                            updates.password = hash
                            resolve()
                        })
                    })
                )
            }

            return Promise.all(tasks)
                .then(() => {
                    Object.assign(user, updates)
                    return user.save()
                })
                .then(updated => {
                    const token = updates.email ? signToken(updated) : undefined
                    res.json({
                        name: updated.name,
                        email: updated.email,
                        photo: updated.photo,
                        accessLevel: updated.accessLevel,
                        ...(token && { token })
                    })
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