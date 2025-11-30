import { body } from 'express-validator';

export const createBookingValidation = [
    body('eventId')
        .notEmpty().withMessage('Event ID is required')
        .isString().withMessage('Event ID must be a string'),

    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ max: 255 }).withMessage('Name must not exceed 255 characters'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Email must be valid'),

    body('mobile')
        .trim()
        .notEmpty().withMessage('Mobile number is required')
        .matches(/^[+]?[\d\s-()]+$/).withMessage('Mobile number must be valid'),

    body('quantity')
        .notEmpty().withMessage('Quantity is required')
        .isInt({ min: 1, max: 10 }).withMessage('Quantity must be between 1 and 10')
];

export const updateBookingStatusValidation = [
    body('status')
        .notEmpty().withMessage('Status is required')
        .isIn(['confirmed', 'cancelled']).withMessage('Status must be either confirmed or cancelled')
];
