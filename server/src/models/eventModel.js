import db from '../config/database.js';

class EventModel {
    // Get all events with filtering and sorting
    static async findAll(filters = {}) {
        let query = 'SELECT * FROM events WHERE 1=1';
        const params = [];

        // Search filter
        if (filters.search) {
            query += ' AND (title LIKE ? OR description LIKE ?)';
            const searchTerm = `%${filters.search}%`;
            params.push(searchTerm, searchTerm);
        }

        // Location filter
        if (filters.location) {
            query += ' AND location LIKE ?';
            params.push(`%${filters.location}%`);
        }

        // Date range filters
        if (filters.dateFrom) {
            query += ' AND date >= ?';
            params.push(filters.dateFrom);
        }

        if (filters.dateTo) {
            query += ' AND date <= ?';
            params.push(filters.dateTo);
        }

        // Sorting
        const sortBy = filters.sortBy || 'date';
        const sortOrder = filters.sortOrder === 'desc' ? 'DESC' : 'ASC';

        const sortColumn = {
            date: 'date',
            price: 'price',
            title: 'title'
        }[sortBy] || 'date';

        query += ` ORDER BY ${sortColumn} ${sortOrder}`;

        const [rows] = await db.query(query, params);
        return rows.map(this.formatEvent);
    }

    // Get single event by ID
    static async findById(id) {
        const [rows] = await db.query('SELECT * FROM events WHERE id = ?', [id]);
        return rows.length > 0 ? this.formatEvent(rows[0]) : null;
    }

    // Create new event
    static async create(eventData) {
        const { title, description, location, date, totalSeats, price, image } = eventData;

        const [result] = await db.query(
            `INSERT INTO events (title, description, location, date, total_seats, available_seats, price, image)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, description, location, date, totalSeats, totalSeats, price, image || null]
        );

        return this.findById(result.insertId);
    }

    // Update event
    static async update(id, eventData) {
        const updates = [];
        const params = [];

        const fieldMap = {
            title: 'title',
            description: 'description',
            location: 'location',
            date: 'date',
            totalSeats: 'total_seats',
            availableSeats: 'available_seats',
            price: 'price',
            image: 'image'
        };

        Object.entries(eventData).forEach(([key, value]) => {
            if (fieldMap[key] && value !== undefined) {
                updates.push(`${fieldMap[key]} = ?`);
                params.push(value);
            }
        });

        if (updates.length === 0) {
            return this.findById(id);
        }

        params.push(id);
        await db.query(
            `UPDATE events SET ${updates.join(', ')} WHERE id = ?`,
            params
        );

        return this.findById(id);
    }

    // Delete event
    static async delete(id) {
        // Check if event has bookings
        const [bookings] = await db.query(
            'SELECT COUNT(*) as count FROM bookings WHERE event_id = ? AND status = "confirmed"',
            [id]
        );

        if (bookings[0].count > 0) {
            const error = new Error('Cannot delete event with existing bookings');
            error.status = 400;
            error.code = 'HAS_BOOKINGS';
            throw error;
        }

        const [result] = await db.query('DELETE FROM events WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    // Format event data for API response
    static formatEvent(row) {
        return {
            id: row.id.toString(),
            title: row.title,
            description: row.description,
            location: row.location,
            date: new Date(row.date).toISOString(),
            totalSeats: row.total_seats,
            availableSeats: row.available_seats,
            price: parseFloat(row.price),
            image: row.image
        };
    }

    // Update available seats (for booking operations)
    static async updateAvailableSeats(id, change) {
        await db.query(
            'UPDATE events SET available_seats = available_seats + ? WHERE id = ?',
            [change, id]
        );
        return this.findById(id);
    }
}

export default EventModel;
