import BookingModel from '../models/bookingModel.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// Get all bookings
export const getAllBookings = asyncHandler(async (req, res) => {
    const eventId = req.query.eventId;
    const bookings = await BookingModel.findAll(eventId);

    res.json({
        data: bookings
    });
});

// Get booking by ID
export const getBookingById = asyncHandler(async (req, res) => {
    const booking = await BookingModel.findById(req.params.id);

    if (!booking) {
        const error = new Error('Booking not found');
        error.status = 404;
        error.code = 'NOT_FOUND';
        throw error;
    }

    res.json({
        data: booking
    });
});

// Create new booking
export const createBooking = asyncHandler(async (req, res) => {
    const booking = await BookingModel.create(req.body);

    res.status(201).json({
        data: booking,
        message: 'Booking confirmed successfully'
    });
});

// Update booking status
export const updateBookingStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const booking = await BookingModel.updateStatus(req.params.id, status);

    res.json({
        data: booking,
        message: 'Booking status updated'
    });
});
