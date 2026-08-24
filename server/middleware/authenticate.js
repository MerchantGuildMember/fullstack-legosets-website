const jwt = require('jsonwebtoken')
const createError = require('http-errors')
const { publicKey } = require('../config/keys')

function authenticate(req, res, next) {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(createError(401, 'No token provided'))
    }

    const token = authHeader.split(' ')[1]

    jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
        if (err) return next(createError(401, 'Invalid or expired token'))
        req.user = decoded
        next()
    })
}

module.exports = authenticate