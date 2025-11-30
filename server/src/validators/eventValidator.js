import { body } from 'express-validator';

export const createEventValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ max: 255 }).withMessage('Title must not exceed 255 characters'),

    body('description')
        .trim()
        .notEmpty().withMessage('Description is required'),

    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 255 }).withMessage('Location must not exceed 255 characters'),

    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be in valid ISO format'),

    body('totalSeats')
        .notEmpty().withMessage('Total seats is required')
        .isInt({ min: 1 }).withMessage('Total seats must be a positive integer'),

    body('price')
        .notEmpty().withMessage('Price is required')
        .isFloat({ min: 0 }).withMessage('Price must be a positive number'),

    body('image')
        .optional()
        .trim()
        .isURL().withMessage('Image must be a valid URL')
];

export const updateEventValidation = [
    body('title')
        .optional()
        .trim()
        .isLength({ max: 255 }).withMessage('Title must not exceed 255 characters'),

    body('description')
        .optional()
        .trim(),

    body('location')
        .optional()
        .trim()
        .isLength({ max: 255 }).withMessage('Location must not exceed 255 characters'),

    body('date')
        .optional()
        .isISO8601().withMessage('Date must be in valid ISO format'),

    body('totalSeats')
        .optional()
        .isInt({ min: 1 }).withMessage('Total seats must be a positive integer'),

    body('availableSeats')
        .optional()
        .isInt({ min: 0 }).withMessage('Available seats must be a non-negative integer'),

    body('price')
        .optional()
        .isFloat({ min: 0 }).withMessage('Price must be a positive number'),

    body('image')
        .optional()
        .trim()
        .isURL().withMessage('Image must be a valid URL')
];
