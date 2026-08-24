const createError = require('http-errors');

const ACCESS_LEVEL_ADMIN = parseInt(process.env.ACCESS_LEVEL_ADMIN);

module.exports = function requireAdmin(req, res, next) {
    if (!req.user || req.user.accessLevel !== ACCESS_LEVEL_ADMIN) {
        return next(createError(403, 'Admin access required'));
    }
    next();
};