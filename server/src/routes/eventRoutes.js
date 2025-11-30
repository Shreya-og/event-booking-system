import express from 'express';
import {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
} from '../controllers/eventController.js';
import { validate } from '../middleware/validator.js';
import { createEventValidation, updateEventValidation } from '../validators/eventValidator.js';

const router = express.Router();

// GET /api/events - Get all events with filters
router.get('/', getAllEvents);

// GET /api/events/:id - Get single event
router.get('/:id', getEventById);

// POST /api/events - Create new event (Admin)
router.post('/', createEventValidation, validate, createEvent);

// PUT /api/events/:id - Update event (Admin)
router.put('/:id', updateEventValidation, validate, updateEvent);

// DELETE /api/events/:id - Delete event (Admin)
router.delete('/:id', deleteEvent);

export default router;
