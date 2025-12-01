`CREATE DATABASE IF NOT EXISTS eventify_db;`
`USE eventify_db;`

`
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
`;

`
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
`;

`
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    admin CHAR(3) NOT NULL DEFAULT 'no',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
`;


`INSERT INTO events (title, description, location, date, total_seats, available_seats, price, image)
      VALUES 
        ('Tech Innovation Summit 2025', 'Join industry leaders discussing the future of AI, blockchain, and quantum computing. Network with top professionals and gain insights into emerging technologies.', 'San Francisco, CA', '2025-03-15 09:00:00', 500, 450, 299.00, 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'),
        ('Digital Marketing Masterclass', 'Learn advanced digital marketing strategies from experts. Topics include SEO, social media marketing, content strategy, and analytics.', 'New York, NY', '2025-04-20 10:00:00', 300, 280, 199.00, 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800'),
        ('Web Development Bootcamp', 'Intensive hands-on bootcamp covering modern web technologies including React, Node.js, and cloud deployment.', 'Austin, TX', '2025-05-10 09:00:00', 150, 120, 499.00, 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800'),
        ('Data Science Conference 2025', 'Explore the latest trends in data science, machine learning, and big data analytics. Featuring workshops and keynote speakers.', 'Boston, MA', '2025-06-05 08:30:00', 400, 350, 349.00, 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800'),
        ('UX/UI Design Workshop', 'Master modern design principles and tools. Learn Figma, prototyping, user research, and design systems.', 'Seattle, WA', '2025-07-12 10:00:00', 200, 180, 249.00, 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800'),
        ('Cloud Computing Summit', 'Deep dive into AWS, Azure, and Google Cloud. Learn about serverless architecture, containerization, and DevOps.', 'Denver, CO', '2025-08-18 09:00:00', 350, 320, 399.00, 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800')
      ON DUPLICATE KEY UPDATE id=id
`