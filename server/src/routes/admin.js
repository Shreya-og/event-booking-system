import express from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import pool from '../config/database.js';

const router = express.Router();

// Example protected admin endpoint
router.get('/stats', authenticate, requireAdmin, async (req, res) => {
  try {
    const [[{ count: userCount }]] = await pool.query('SELECT COUNT(*) AS count FROM users');
    const [[{ count: eventCount }]] = await pool.query('SELECT COUNT(*) AS count FROM events'); 

    return res.json({ users: userCount, events: eventCount });
  } catch (err) {
    console.error('Admin stats error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;