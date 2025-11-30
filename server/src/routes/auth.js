import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import pool from '../config/database.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'please_change_this_secret';
const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY || '7d'; // token lifetime

// Register
router.post(
  '/register',
  body('username').isLength({ min: 3 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const { username, email, password } = req.body;

    try {
      // check existing email
      const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
      if (rows.length > 0) return res.status(409).json({ message: 'Email already registered' });

      const passwordHash = await bcrypt.hash(password, 10);

      const [result] = await pool.query(
        'INSERT INTO users (username, email, password_hash, admin) VALUES (?, ?, ?, ?)',
        [username, email, passwordHash, 'no'] // default admin = 'no'
      );

      const userId = result.insertId;
      const [userRows] = await pool.query('SELECT id, username, email, admin FROM users WHERE id = ?', [userId]);
      const user = userRows[0];

      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });

      return res.json({ token, user });
    } catch (err) {
      console.error('Register error', err);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

// Login
router.post(
  '/login',
  body('email').isEmail(),
  body('password').exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
      const [rows] = await pool.query(
        'SELECT id, username, email, password_hash, admin FROM users WHERE email = ?',
        [email]
      );

      if (rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

      const user = rows[0];
      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) return res.status(401).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });

      // return minimal user
      const publicUser = { id: user.id, username: user.username, email: user.email, admin: user.admin };
      return res.json({ token, user: publicUser });
    } catch (err) {
      console.error('Login error', err);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

export default router;