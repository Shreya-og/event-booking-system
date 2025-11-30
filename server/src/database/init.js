import mysql from 'mysql2/promise';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const initDatabase = async () => {
    let connection;

    try {
        
        let connectionConfig;

        if (process.env.DATABASE_URL) {
          // Prefer parsing the URL so we can easily build a non-database connection
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
            // If parsing fails, fall back to letting the library handle the URL string
            connectionConfig = process.env.DATABASE_URL;
          }
        } else {
          connectionConfig = {
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
            database: process.env.DB_NAME || 'eventify_db',
          };
        }

        // Setup SSL options if requested 
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
            // Allow setting CA contents directly (base64 encoded) — useful for env vars
            try {
              sslOptions.ca = Buffer.from(process.env.DB_SSL_CA_CONTENT, 'base64').toString('utf8');
            } catch (err) {
              console.warn('⚠️  DB_SSL_CA_CONTENT invalid base64:', err.message);
            }
          }

          connectionConfig.ssl = sslOptions;
        }


        let connectFirst = connectionConfig;
        if (typeof connectionConfig === 'object') {
          connectFirst = { ...connectionConfig };
          delete connectFirst.database; 
        }

        connection = typeof connectFirst === 'string'
          ? await mysql.createConnection(connectFirst)
          : await mysql.createConnection(connectFirst);

        console.log('🔄 Creating database...');

        const dbName = (typeof connectionConfig === 'object' && connectionConfig.database)
          ? connectionConfig.database
          : process.env.DB_NAME || 'eventify_db';

        try {
          await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
          console.log('✅ Database created/verified');
          await connection.query(`USE \`${dbName}\``);
        } catch (err) {
          
          console.warn('⚠️  Could not create/use database (likely permission issue) — skipping.');
        }

        // Create events table
        console.log('🔄 Creating events table...');
        await connection.query(`
      CREATE TABLE IF NOT EXISTS events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        location VARCHAR(255) NOT NULL,
        date DATETIME NOT NULL,
        total_seats INT NOT NULL,
        available_seats INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        image VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_date (date),
        INDEX idx_location (location)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        console.log('✅ Events table created');

        // Create bookings table
        console.log('🔄 Creating bookings table...');
        await connection.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        event_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        mobile VARCHAR(20) NOT NULL,
        quantity INT NOT NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        booking_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        status ENUM('confirmed', 'cancelled') DEFAULT 'confirmed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
        INDEX idx_event_id (event_id),
        INDEX idx_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        console.log('✅ Bookings table created');

        // Create users table
        console.log('🔄 Creating users table...');
        await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        admin CHAR(3) NOT NULL DEFAULT 'no',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log('✅ users table created');

        // Insert sample data
        console.log('🔄 Inserting sample events...');
        await connection.query(`
      INSERT INTO events (title, description, location, date, total_seats, available_seats, price, image)
      VALUES 
        ('Tech Innovation Summit 2025', 'Join industry leaders discussing the future of AI, blockchain, and quantum computing. Network with top professionals and gain insights into emerging technologies.', 'San Francisco, CA', '2025-03-15 09:00:00', 500, 450, 299.00, 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'),
        ('Digital Marketing Masterclass', 'Learn advanced digital marketing strategies from experts. Topics include SEO, social media marketing, content strategy, and analytics.', 'New York, NY', '2025-04-20 10:00:00', 300, 280, 199.00, 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800'),
        ('Web Development Bootcamp', 'Intensive hands-on bootcamp covering modern web technologies including React, Node.js, and cloud deployment.', 'Austin, TX', '2025-05-10 09:00:00', 150, 120, 499.00, 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800'),
        ('Data Science Conference 2025', 'Explore the latest trends in data science, machine learning, and big data analytics. Featuring workshops and keynote speakers.', 'Boston, MA', '2025-06-05 08:30:00', 400, 350, 349.00, 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800'),
        ('UX/UI Design Workshop', 'Master modern design principles and tools. Learn Figma, prototyping, user research, and design systems.', 'Seattle, WA', '2025-07-12 10:00:00', 200, 180, 249.00, 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800'),
        ('Cloud Computing Summit', 'Deep dive into AWS, Azure, and Google Cloud. Learn about serverless architecture, containerization, and DevOps.', 'Denver, CO', '2025-08-18 09:00:00', 350, 320, 399.00, 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800')
      ON DUPLICATE KEY UPDATE id=id
    `);
        console.log('✅ Sample events inserted');

        console.log('\n🎉 Database initialization completed successfully!');

    } catch (error) {
        console.error('❌ Error initializing database:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

initDatabase();
