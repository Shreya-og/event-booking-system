import EventModel from '../models/eventModel.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// Get all events
export const getAllEvents = asyncHandler(async (req, res) => {
    const filters = {
        search: req.query.search,
        location: req.query.location,
        dateFrom: req.query.dateFrom,
        dateTo: req.query.dateTo,
        sortBy: req.query.sortBy,
        sortOrder: req.query.sortOrder
    };

    const events = await EventModel.findAll(filters);

    res.json({
        data: events
    });
});

// Get event by ID
export const getEventById = asyncHandler(async (req, res) => {
    const event = await EventModel.findById(req.params.id);

    if (!event) {
        const error = new Error('Event not found');
        error.status = 404;
        error.code = 'NOT_FOUND';
        throw error;
    }

    res.json({
        data: event
    });
});

// Create new event
export const createEvent = asyncHandler(async (req, res) => {
    const event = await EventModel.create(req.body);

    res.status(201).json({
        data: event,
        message: 'Event created successfully'
    });
});

// Update event
export const updateEvent = asyncHandler(async (req, res) => {
    const existingEvent = await EventModel.findById(req.params.id);

    if (!existingEvent) {
        const error = new Error('Event not found');
        error.status = 404;
        error.code = 'NOT_FOUND';
        throw error;
    }

    const event = await EventModel.update(req.params.id, req.body);

    res.json({
        data: event,
        message: 'Event updated successfully'
    });
});

// Delete event
export const deleteEvent = asyncHandler(async (req, res) => {
    const existingEvent = await EventModel.findById(req.params.id);

    if (!existingEvent) {
        const error = new Error('Event not found');
        error.status = 404;
        error.code = 'NOT_FOUND';
        throw error;
    }

    await EventModel.delete(req.params.id);

    res.json({
        data: null,
        message: 'Event deleted successfully'
    });
});
