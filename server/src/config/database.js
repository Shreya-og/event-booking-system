import mysql from 'mysql2/promise';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

// Build connection config supporting either DATABASE_URL or individual env vars.
// Also supports SSL via DB_SSL and either DB_SSL_CA (path) or DB_SSL_CA_CONTENT (base64).
let connectionConfig;

if (process.env.DATABASE_URL) {
    try {
        const url = new URL(process.env.DATABASE_URL);
        connectionConfig = {
            host: url.hostname,
            port: url.port ? Number(url.port) : undefined,
            user: decodeURIComponent(url.username) || undefined,
            password: decodeURIComponent(url.password) || undefined,
            database: url.pathname ? url.pathname.replace(/^\//, '') : undefined,
        };
    } catch (err) {
        // Fallback — mysql2 try handling the connection string if parsing fails
        connectionConfig = process.env.DATABASE_URL;
    }
} else {
    connectionConfig = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'eventify_db',
        port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    };
}

// SSL config
const wantSsl = process.env.DB_SSL && process.env.DB_SSL !== 'false' && process.env.DB_SSL !== '0';
if (wantSsl && typeof connectionConfig === 'object') {
    const sslOptions = { rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false' };

    if (process.env.DB_SSL_CA) {
        try {
            sslOptions.ca = fs.readFileSync(process.env.DB_SSL_CA, 'utf8');
        } catch (err) {
            console.warn('⚠️  Could not read DB_SSL_CA file:', err.message);
        }
    } else if (process.env.DB_SSL_CA_CONTENT) {
        try {
            sslOptions.ca = Buffer.from(process.env.DB_SSL_CA_CONTENT, 'base64').toString('utf8');
        } catch (err) {
            console.warn('⚠️  DB_SSL_CA_CONTENT invalid base64:', err.message);
        }
    }

    connectionConfig.ssl = sslOptions;
}

// Pool options
let pool;
if (typeof connectionConfig === 'string') {
    // connectionConfig is a URL string — pass it directly to createPool.
    // Note: when passing a string you can't mix in the pool options object, so
    // connectionLimit will be whatever the library default is. 
    pool = mysql.createPool(connectionConfig);
} else {
    Object.assign(connectionConfig, {
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    pool = mysql.createPool(connectionConfig);
}

// Test connection
pool.getConnection()
    .then(connection => {
        console.log('✅ Database connected successfully');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Database connection failed:', err.message);
    });

export default pool;
