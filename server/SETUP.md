# Quick Setup Guide

Follow these steps to get the backend up and running quickly.

## Step 1: Install Dependencies

```bash
cd backend
npm install
```

## Step 2: Configure Database

1. Make sure MySQL is running on your system
2. Create a `.env` file from the example:

```bash
cp .env.example .env
```

3. Edit `.env` and update these values:

```env
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=eventify_db
```

## Step 3: Initialize Database

This command creates the database, tables, and adds sample events:

```bash
npm run init-db
```

Expected output:

```
✅ Database created/verified
✅ Events table created
✅ Bookings table created
✅ Sample events inserted
🎉 Database initialization completed successfully!
```

## Step 4: Start the Server

```bash
npm run dev
```

Expected output:

```
✅ Database connected successfully
🚀 Server is running on http://localhost:5000
📡 API endpoints available at http://localhost:5000/api
🌍 Environment: development
```

## Step 5: Test the API

Open a new terminal and test:

```bash
# Health check
curl http://localhost:5000/health

# Get all events
curl http://localhost:5000/api/events

# Get single event
curl http://localhost:5000/api/events/1
```

## Step 6: Connect Frontend

1. Make sure your frontend `.env` has:

   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

2. Start your frontend:

   ```bash
   cd ../eventify-hub
   npm run dev
   ```

3. The frontend should now connect to your backend!

## Troubleshooting

### Database Connection Failed

**Error:** `Access denied for user 'root'@'localhost'`

**Solution:**

- Check your MySQL password in `.env`
- Test MySQL connection: `mysql -u root -p`

### Port 5000 Already in Use

**Solution:**

```bash
# Change PORT in .env to another port like 5001
PORT=5001
```

### Module Not Found

**Solution:**

```bash
rm -rf node_modules package-lock.json
npm install
```

## What's Next?

- Review `README.md` for detailed documentation
- Check `API_DOCUMENTATION.md` for API details
- Test API endpoints with Postman or Thunder Client
- Explore the code in `src/` directory

## Common Commands

```bash
# Development mode (auto-reload)
npm run dev

# Production mode
npm start

# Reinitialize database (warning: deletes existing data)
npm run init-db
```

## Need Help?

- Check the main `README.md` for comprehensive docs
- Review `API_DOCUMENTATION.md` for endpoint details
- Look at the code examples in the documentation
