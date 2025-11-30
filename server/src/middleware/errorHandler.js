// Error handler middleware
export const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Validation error
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            message: err.message,
            code: 'VALIDATION_ERROR',
            details: err.details || {}
        });
    }

    // Database error
    if (err.code?.startsWith('ER_')) {
        return res.status(500).json({
            message: 'Database operation failed',
            code: 'DATABASE_ERROR',
            details: process.env.NODE_ENV === 'development' ? err.message : {}
        });
    }

    // Default error
    res.status(err.status || 500).json({
        message: err.message || 'Internal server error',
        code: err.code || 'INTERNAL_ERROR',
        details: err.details || {}
    });
};

// Not found handler
export const notFoundHandler = (req, res) => {
    res.status(404).json({
        message: 'Route not found',
        code: 'NOT_FOUND'
    });
};

// Async handler wrapper
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
