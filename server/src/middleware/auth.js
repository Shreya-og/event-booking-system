import jwt from 'jsonwebtoken';
import pool from '../config/database.js';
const JWT_SECRET = process.env.JWT_SECRET || 'please_change_this_secret';

// attach user object to req.user when token valid
export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Missing Authorization header' });

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ message: 'Invalid Authorization format' });
    }

    const token = parts[1];
    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // fetch user from DB (public fields only)
    const [rows] = await pool.query('SELECT id, username, email, admin FROM users WHERE id = ?', [payload.id]);
    if (rows.length === 0) return res.status(401).json({ message: 'User not found' });

    req.user = rows[0];
    next();
  } catch (err) {
    console.error('Authenticate middleware error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ message: 'Unauthenticated' });
  if (req.user.admin !== 'yes') return res.status(403).json({ message: 'Forbidden - admin only' });
  return next();
}