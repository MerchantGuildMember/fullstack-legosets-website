const createError = require('http-errors');

function notFound(req, res, next) {
    next(createError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

function errorHandler(err, req, res, next) {
    const status = err.status || err.statusCode || 500;

    if (status >= 500) {
        console.error(err);
    }

    res.status(status).json({
        message: status >= 500 ? 'Something went wrong' : err.message
    });
}

module.exports = { notFound, errorHandler };
