# Eventify Backend API

Backend API for Event Booking System built with Node.js, Express, and MySQL.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **MySQL** (v8 or higher)
- **npm** or **yarn**

## 🚀 Quick Start

### 1. Clone and Setup

```bash
cd backend
npm install
```

### 2. Configure Environment

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=eventify_db
DB_PORT=3306

# CORS Configuration
FRONTEND_URL=http://localhost:8080
```

### 3. Initialize Database

This will create the database, tables, and seed sample data:

```bash
npm run init-db
```

### 4. Start the Server

**Development mode** (with auto-reload):

```bash
npm run dev
```

**Production mode**:

```bash
npm start
```

The server will run at `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Database connection pool
│   ├── controllers/
│   │   ├── eventController.js   # Event business logic
│   │   └── bookingController.js # Booking business logic
│   ├── models/
│   │   ├── eventModel.js        # Event data access
│   │   └── bookingModel.js      # Booking data access
│   ├── routes/
│   │   ├── eventRoutes.js       # Event API routes
│   │   └── bookingRoutes.js     # Booking API routes
│   ├── validators/
│   │   ├── eventValidator.js    # Event input validation
│   │   └── bookingValidator.js  # Booking input validation
│   ├── middleware/
│   │   ├── errorHandler.js      # Error handling middleware
│   │   └── validator.js         # Validation middleware
│   ├── database/
│   │   └── init.js              # Database initialization script
│   └── server.js                # Express app entry point
├── .env                         # Environment variables (create this)
├── .env.example                 # Environment template
├── .gitignore
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Base URL

```
http://localhost:5000/api
```

### Events

| Method | Endpoint      | Description                   | Auth  |
| ------ | ------------- | ----------------------------- | ----- |
| GET    | `/events`     | Get all events (with filters) | No    |
| GET    | `/events/:id` | Get single event              | No    |
| POST   | `/events`     | Create new event              | Admin |
| PUT    | `/events/:id` | Update event                  | Admin |
| DELETE | `/events/:id` | Delete event                  | Admin |

### Bookings

| Method | Endpoint        | Description           | Auth  |
| ------ | --------------- | --------------------- | ----- |
| GET    | `/bookings`     | Get all bookings      | Admin |
| GET    | `/bookings/:id` | Get single booking    | No    |
| POST   | `/bookings`     | Create new booking    | No    |
| PATCH  | `/bookings/:id` | Update booking status | Admin |

## 📝 API Documentation

Full API documentation is available in [`API_DOCUMENTATION.md`](../API_DOCUMENTATION.md)

### Example Requests

#### Get All Events with Filters

```bash
GET http://localhost:5000/api/events?search=tech&location=San%20Francisco&sortBy=date&sortOrder=asc
```

#### Create Event

```bash
POST http://localhost:5000/api/events
Content-Type: application/json

{
  "title": "Tech Summit 2025",
  "description": "Annual technology conference",
  "location": "San Francisco, CA",
  "date": "2025-03-15T09:00:00Z",
  "totalSeats": 500,
  "price": 299,
  "image": "https://example.com/image.jpg"
}
```

#### Create Booking

```bash
POST http://localhost:5000/api/bookings
Content-Type: application/json

{
  "eventId": "1",
  "name": "John Doe",
  "email": "john@example.com",
  "mobile": "+1234567890",
  "quantity": 2
}
```

## 🗄️ Database Schema

### Events Table

```sql
CREATE TABLE events (
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
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Bookings Table

```sql
CREATE TABLE bookings (
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
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);
```

### Users Table

```sql
 CREATE TABLE  users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  admin CHAR(3) NOT NULL DEFAULT 'no',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## ✅ Features

- ✨ RESTful API design
- 🔍 Advanced filtering and sorting
- 🛡️ Input validation with express-validator
- 🔄 Database transactions for booking operations
- 🚨 Comprehensive error handling
- 🌐 CORS enabled
- 📊 Connection pooling for MySQL
- 🎯 Proper HTTP status codes
- 📝 Consistent API response format

## 🔧 Configuration

### Environment Variables

| Variable       | Description           | Default               |
| -------------- | --------------------- | --------------------- |
| `PORT`         | Server port           | 5000                  |
| `NODE_ENV`     | Environment mode      | development           |
| `DB_HOST`      | MySQL host            | localhost             |
| `DB_USER`      | MySQL username        | root                  |
| `DB_PASSWORD`  | MySQL password        | -                     |
| `DB_NAME`      | Database name         | eventify_db           |
| `DB_PORT`      | MySQL port            | 3306                  |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:5173 |

## 🧪 Testing the API

### Using curl

```bash
# Health check
curl http://localhost:5000/health

# Get all events
curl http://localhost:5000/api/events

# Get single event
curl http://localhost:5000/api/events/1

# Create booking
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "eventId": "1",
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "+1234567890",
    "quantity": 2
  }'
```

### Using Postman or Thunder Client

Import the following endpoints:

- Base URL: `http://localhost:5000/api`
- See `API_DOCUMENTATION.md` for detailed endpoint documentation

## 🛠️ Development

### Available Scripts

```bash
# Install dependencies
npm install

# Initialize database with sample data
npm run init-db

# Start development server (with nodemon)
npm run dev

# Start production server
npm start
```

### Adding New Routes

1. Create model in `src/models/`
2. Create controller in `src/controllers/`
3. Create validator in `src/validators/`
4. Create routes in `src/routes/`
5. Register routes in `src/server.js`

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check MySQL is running
mysql --version

# Test connection
mysql -u root -p

# Grant privileges
GRANT ALL PRIVILEGES ON eventify_db.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

### Port Already in Use

```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### Module Not Found Errors

```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📦 Dependencies

### Production Dependencies

- **express** - Web framework
- **mysql2** - MySQL client with promises
- **cors** - CORS middleware
- **dotenv** - Environment variable management
- **express-validator** - Input validation

### Development Dependencies

- **nodemon** - Auto-reload during development

## 🔐 Security Notes

⚠️ **Important for Production:**

1. **Never commit `.env` file** - Contains sensitive credentials
2. **Use strong database passwords**
3. **Implement authentication** - Add JWT or session-based auth for admin routes
4. **Add rate limiting** - Prevent API abuse
5. **Input sanitization** - Already implemented with express-validator
6. **Use HTTPS** - In production environment
7. **Regular updates** - Keep dependencies updated

## 🚀 Production Deployment

### Prerequisites

- Set `NODE_ENV=production`
- Use environment-specific database
- Enable SSL/TLS for database connections
- Implement proper logging
- Set up monitoring

### Recommended Platforms

- AWS EC2 / RDS
- Google Cloud Platform
- DigitalOcean
- Heroku
- Railway


## 👥 Support

For issues or questions:

1. Check `API_DOCUMENTATION.md` for endpoint details
2. Review this README for setup instructions
3. Check the troubleshooting section above

---

Built with ❤️ using Node.js, Express, and MySQL