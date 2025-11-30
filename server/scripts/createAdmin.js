import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import pool from '../src/config/database.js';
dotenv.config();

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin@123';
  const username = process.env.ADMIN_USERNAME || 'Admin';

  const pwdHash = await bcrypt.hash(password, 10);

  try {
    // ensure no duplicate
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      console.log('Admin already exists. Updating admin flag and password hash...');
      await pool.query('UPDATE users SET admin = ?, password_hash = ? WHERE email = ?', ['yes', pwdHash, email]);
      console.log('Updated existing admin user.');
      process.exit(0);
    }

    const [result] = await pool.query(
      'INSERT INTO users (username, email, password_hash, admin) VALUES (?, ?, ?, ?)',
      [username, email, pwdHash, 'yes']
    );

    console.log('Admin created with id', result.insertId);
    process.exit(0);
  } catch (err) {
    console.error('Create admin error', err);
    process.exit(1);
  }
}

createAdmin();
