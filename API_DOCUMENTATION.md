# Event Booking System - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Response Format

### Success Response
```json
{
  "data": {...},
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "message": "Error description",
  "code": "ERROR_CODE",
  "details": {}
}
```

---

## Event APIs

### 1. Get All Events
**Endpoint:** `GET /events`

**Query Parameters:**
- `search` (optional): Search by event title or description
- `location` (optional): Filter by location
- `dateFrom` (optional): Filter events from this date (ISO format)
- `dateTo` (optional): Filter events until this date (ISO format)
- `sortBy` (optional): Sort by field (`date`, `price`, `title`)
- `sortOrder` (optional): Sort order (`asc`, `desc`)

**Example Request:**
```
GET /events?search=tech&location=San%20Francisco&sortBy=date&sortOrder=asc
```

**Response:**
```json
{
  "data": [
    {
      "id": "1",
      "title": "Tech Innovation Summit 2025",
      "description": "Join industry leaders discussing the future of AI...",
      "location": "San Francisco, CA",
      "date": "2025-03-15T09:00:00Z",
      "totalSeats": 500,
      "availableSeats": 150,
      "price": 299,
      "image": "https://example.com/image.jpg"
    }
  ]
}
```

---

### 2. Get Event by ID
**Endpoint:** `GET /events/:id`

**Example Request:**
```
GET /events/1
```

**Response:**
```json
{
  "data": {
    "id": "1",
    "title": "Tech Innovation Summit 2025",
    "description": "Join industry leaders discussing the future of AI...",
    "location": "San Francisco, CA",
    "date": "2025-03-15T09:00:00Z",
    "totalSeats": 500,
    "availableSeats": 150,
    "price": 299,
    "image": "https://example.com/image.jpg"
  }
}
```

**Error Responses:**
- `404 Not Found`: Event not found

---

### 3. Create Event (Admin)
**Endpoint:** `POST /events`

**Request Body:**
```json
{
  "title": "Tech Innovation Summit 2025",
  "description": "Join industry leaders discussing the future of AI...",
  "location": "San Francisco, CA",
  "date": "2025-03-15T09:00:00Z",
  "totalSeats": 500,
  "price": 299,
  "image": "https://example.com/image.jpg"
}
```

**Response:**
```json
{
  "data": {
    "id": "1",
    "title": "Tech Innovation Summit 2025",
    "description": "Join industry leaders discussing the future of AI...",
    "location": "San Francisco, CA",
    "date": "2025-03-15T09:00:00Z",
    "totalSeats": 500,
    "availableSeats": 500,
    "price": 299,
    "image": "https://example.com/image.jpg"
  },
  "message": "Event created successfully"
}
```

**Validation Rules:**
- `title`: Required, max 255 characters
- `description`: Required
- `location`: Required, max 255 characters
- `date`: Required, valid ISO datetime
- `totalSeats`: Required, positive integer
- `price`: Required, positive number
- `image`: Optional, valid URL

**Error Responses:**
- `400 Bad Request`: Validation errors
- `401 Unauthorized`: Admin authentication required

---

### 4. Update Event (Admin)
**Endpoint:** `PUT /events/:id`

**Request Body:** (All fields optional)
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "location": "New Location",
  "date": "2025-04-15T09:00:00Z",
  "totalSeats": 600,
  "availableSeats": 200,
  "price": 349,
  "image": "https://example.com/new-image.jpg"
}
```

**Response:**
```json
{
  "data": {
    "id": "1",
    "title": "Updated Title",
    "description": "Updated description",
    "location": "New Location",
    "date": "2025-04-15T09:00:00Z",
    "totalSeats": 600,
    "availableSeats": 200,
    "price": 349,
    "image": "https://example.com/new-image.jpg"
  },
  "message": "Event updated successfully"
}
```

**Error Responses:**
- `404 Not Found`: Event not found
- `400 Bad Request`: Validation errors
- `401 Unauthorized`: Admin authentication required

---

### 5. Delete Event (Admin)
**Endpoint:** `DELETE /events/:id`

**Example Request:**
```
DELETE /events/1
```

**Response:**
```json
{
  "data": null,
  "message": "Event deleted successfully"
}
```

**Error Responses:**
- `404 Not Found`: Event not found
- `401 Unauthorized`: Admin authentication required
- `400 Bad Request`: Cannot delete event with existing bookings

---

## Booking APIs

### 6. Create Booking
**Endpoint:** `POST /bookings`

**Request Body:**
```json
{
  "eventId": "1",
  "name": "John Doe",
  "email": "john@example.com",
  "mobile": "+1234567890",
  "quantity": 2
}
```

**Response:**
```json
{
  "data": {
    "id": "1",
    "eventId": "1",
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "+1234567890",
    "quantity": 2,
    "totalAmount": 598,
    "bookingDate": "2025-01-15T10:30:00Z",
    "status": "confirmed"
  },
  "message": "Booking confirmed successfully"
}
```

**Business Logic:**
1. Check if event exists
2. Verify available seats >= quantity
3. Calculate totalAmount = event.price * quantity
4. Update event.availableSeats -= quantity
5. Create booking record with status "confirmed"

**Validation Rules:**
- `eventId`: Required, must exist
- `name`: Required, max 255 characters
- `email`: Required, valid email format
- `mobile`: Required, valid phone format
- `quantity`: Required, positive integer, max 10 per booking

**Error Responses:**
- `400 Bad Request`: Validation errors or insufficient seats
- `404 Not Found`: Event not found

---

### 7. Get All Bookings (Admin)
**Endpoint:** `GET /bookings`

**Query Parameters:**
- `eventId` (optional): Filter by specific event

**Example Request:**
```
GET /bookings?eventId=1
```

**Response:**
```json
{
  "data": [
    {
      "id": "1",
      "eventId": "1",
      "name": "John Doe",
      "email": "john@example.com",
      "mobile": "+1234567890",
      "quantity": 2,
      "totalAmount": 598,
      "bookingDate": "2025-01-15T10:30:00Z",
      "status": "confirmed"
    }
  ]
}
```

**Error Responses:**
- `401 Unauthorized`: Admin authentication required

---

### 8. Get Booking by ID
**Endpoint:** `GET /bookings/:id`

**Example Request:**
```
GET /bookings/1
```

**Response:**
```json
{
  "data": {
    "id": "1",
    "eventId": "1",
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "+1234567890",
    "quantity": 2,
    "totalAmount": 598,
    "bookingDate": "2025-01-15T10:30:00Z",
    "status": "confirmed"
  }
}
```

**Error Responses:**
- `404 Not Found`: Booking not found

---

### 9. Update Booking Status (Admin)
**Endpoint:** `PATCH /bookings/:id`

**Request Body:**
```json
{
  "status": "cancelled"
}
```

**Response:**
```json
{
  "data": {
    "id": "1",
    "eventId": "1",
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "+1234567890",
    "quantity": 2,
    "totalAmount": 598,
    "bookingDate": "2025-01-15T10:30:00Z",
    "status": "cancelled"
  },
  "message": "Booking status updated"
}
```

**Business Logic:**
- When cancelling: event.availableSeats += booking.quantity

**Error Responses:**
- `404 Not Found`: Booking not found
- `401 Unauthorized`: Admin authentication required

---

## Database Schema (MySQL)

### events table
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

### bookings table
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

### users table
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
---

## Error Codes

| Code | Description |
|------|-------------|
| VALIDATION_ERROR | Invalid request data |
| NOT_FOUND | Resource not found |
| INSUFFICIENT_SEATS | Not enough available seats |
| UNAUTHORIZED | Authentication required |
| DATABASE_ERROR | Database operation failed |
| NETWORK_ERROR | Network connectivity issue |

---

## Implementation Notes

1. **CORS**: Enable CORS for frontend origin
2. **Date Handling**: Use ISO 8601 format for all dates
3. **Seat Management**: Use database transactions for booking to prevent race conditions
4. **Response Format**: Always wrap data in `{ data: ... }` format
5. **Error Handling**: Return appropriate HTTP status codes with error details
6. **Validation**: Validate all inputs on backend
7. **ID Format**: Frontend sends/receives IDs as strings, backend can store as integers
