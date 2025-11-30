import express from 'express';
import {
    getAllBookings,
    getBookingById,
    createBooking,
    updateBookingStatus
} from '../controllers/bookingController.js';
import { validate } from '../middleware/validator.js';
import {
    createBookingValidation,
    updateBookingStatusValidation
} from '../validators/bookingValidator.js';

const router = express.Router();

// GET /api/bookings - Get all bookings (Admin)
router.get('/', getAllBookings);

// GET /api/bookings/:id - Get single booking
router.get('/:id', getBookingById);

// POST /api/bookings - Create new booking
router.post('/', createBookingValidation, validate, createBooking);

// PATCH /api/bookings/:id - Update booking status (Admin)
router.patch('/:id', updateBookingStatusValidation, validate, updateBookingStatus);

export default router;
