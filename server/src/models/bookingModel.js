import db from '../config/database.js';
import EventModel from './eventModel.js';

class BookingModel {
    // Get all bookings with optional event filter
    static async findAll(eventId = null) {
        let query = 'SELECT * FROM bookings';
        const params = [];

        if (eventId) {
            query += ' WHERE event_id = ?';
            params.push(eventId);
        }

        query += ' ORDER BY booking_date DESC';

        const [rows] = await db.query(query, params);
        return rows.map(this.formatBooking);
    }

    // Get single booking by ID
    static async findById(id) {
        const [rows] = await db.query('SELECT * FROM bookings WHERE id = ?', [id]);
        return rows.length > 0 ? this.formatBooking(rows[0]) : null;
    }

    // Create new booking
    static async create(bookingData) {
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const { eventId, name, email, mobile, quantity } = bookingData;

            // Check if event exists
            const event = await EventModel.findById(eventId);
            if (!event) {
                const error = new Error('Event not found');
                error.status = 404;
                error.code = 'NOT_FOUND';
                throw error;
            }

            // Check available seats
            if (event.availableSeats < quantity) {
                const error = new Error('Insufficient seats available');
                error.status = 400;
                error.code = 'INSUFFICIENT_SEATS';
                error.details = {
                    requested: quantity,
                    available: event.availableSeats
                };
                throw error;
            }

            // Calculate total amount
            const totalAmount = event.price * quantity;

            // Create booking
            const [result] = await connection.query(
                `INSERT INTO bookings (event_id, name, email, mobile, quantity, total_amount, status)
         VALUES (?, ?, ?, ?, ?, ?, 'confirmed')`,
                [eventId, name, email, mobile, quantity, totalAmount]
            );

            // Update available seats
            await connection.query(
                'UPDATE events SET available_seats = available_seats - ? WHERE id = ?',
                [quantity, eventId]
            );

            await connection.commit();

            return this.findById(result.insertId);
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // Update booking status
    static async updateStatus(id, status) {
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const booking = await this.findById(id);
            if (!booking) {
                const error = new Error('Booking not found');
                error.status = 404;
                error.code = 'NOT_FOUND';
                throw error;
            }

            // If cancelling a confirmed booking, restore seats
            if (booking.status === 'confirmed' && status === 'cancelled') {
                await connection.query(
                    'UPDATE events SET available_seats = available_seats + ? WHERE id = ?',
                    [booking.quantity, booking.eventId]
                );
            }

            // Update booking status
            await connection.query(
                'UPDATE bookings SET status = ? WHERE id = ?',
                [status, id]
            );

            await connection.commit();

            return this.findById(id);
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // Format booking data for API response
    static formatBooking(row) {
        return {
            id: row.id.toString(),
            eventId: row.event_id.toString(),
            name: row.name,
            email: row.email,
            mobile: row.mobile,
            quantity: row.quantity,
            totalAmount: parseFloat(row.total_amount),
            bookingDate: new Date(row.booking_date).toISOString(),
            status: row.status
        };
    }
}

export default BookingModel;
