const jwt = require('jsonwebtoken')
const createError = require('http-errors')

function authenticate(req, res, next) {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(createError(401, 'No token provided'))
    }

    const token = authHeader.split(' ')[1]

    jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return next(createError(401, 'Invalid or expired token'))
        req.user = decoded // { email, accessLevel, ... }
        console.log('decoded:', decoded);
        next()
    })
}

module.exports = authenticate