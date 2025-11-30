# API Integration Guide

This document explains the complete API integration implemented in the Event Booking System frontend.

## 📁 Project Structure

```
src/
├── types/
│   └── api.ts                 # TypeScript types and interfaces
├── lib/
│   └── apiClient.ts          # API client with fetch wrapper
├── hooks/
│   ├── useEvents.ts          # Fetch all events
│   ├── useEvent.ts           # Fetch single event
│   ├── useCreateEvent.ts     # Create event (admin)
│   ├── useUpdateEvent.ts     # Update event (admin)
│   ├── useDeleteEvent.ts     # Delete event (admin)
│   ├── useCreateBooking.ts   # Create booking
│   └── useBookings.ts        # Fetch bookings (admin)
└── pages/
    ├── Index.tsx             # Landing page (uses useEvents)
    ├── Events.tsx            # Events listing (uses useEvents)
    └── Admin.tsx             # Admin dashboard (uses all admin hooks)
```

## 🚀 Setup Instructions

### 1. Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 2. Backend Requirements

Your Node.js backend should implement the endpoints documented in `API_DOCUMENTATION.md`. Make sure to:

- Enable CORS for the frontend origin
- Return responses in the format: `{ data: ..., message?: "..." }`
- Handle errors with appropriate status codes
- Use ISO 8601 format for dates

## 📚 Usage Examples

### Fetching Events

```tsx
import { useEvents } from '@/hooks/useEvents';

function MyComponent() {
  const { data: events, isLoading, error } = useEvents({
    search: 'tech',
    location: 'San Francisco',
    sortBy: 'date',
    sortOrder: 'asc'
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {events?.map(event => (
        <div key={event.id}>{event.title}</div>
      ))}
    </div>
  );
}
```

### Creating an Event

```tsx
import { useCreateEvent } from '@/hooks/useCreateEvent';

function CreateEventForm() {
  const createEvent = useCreateEvent();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    createEvent.mutate({
      title: 'Tech Summit',
      description: 'A great tech event',
      location: 'San Francisco, CA',
      date: '2025-03-15T09:00:00Z',
      totalSeats: 500,
      price: 299
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button 
        type="submit" 
        disabled={createEvent.isPending}
      >
        {createEvent.isPending ? 'Creating...' : 'Create Event'}
      </button>
    </form>
  );
}
```

### Booking Tickets

```tsx
import { useCreateBooking } from '@/hooks/useCreateBooking';

function BookingForm({ eventId }: { eventId: string }) {
  const createBooking = useCreateBooking();

  const handleBook = () => {
    createBooking.mutate({
      eventId,
      name: 'John Doe',
      email: 'john@example.com',
      mobile: '+1234567890',
      quantity: 2
    });
  };

  return (
    <button onClick={handleBook} disabled={createBooking.isPending}>
      Book Tickets
    </button>
  );
}
```

## 🔄 React Query Integration

The hooks use TanStack Query (React Query) for:

- **Automatic caching**: Reduces unnecessary API calls
- **Background refetching**: Keeps data fresh
- **Optimistic updates**: Better UX
- **Error handling**: Automatic retry logic
- **Loading states**: Built-in loading indicators

### Query Keys

All queries use consistent query keys:

- `['events', params]` - Events list
- `['event', id]` - Single event
- `['bookings', eventId]` - Bookings list

When mutations succeed, related queries are automatically invalidated and refetched.

## 🎨 Features Implemented

### In All Pages

✅ Loading states with skeleton components  
✅ Error handling with user-friendly messages  
✅ Fallback to mock data when API is unavailable  
✅ Automatic toast notifications for success/error

### Index.tsx (Landing Page)

- Fetches featured events
- Displays loading skeletons
- Shows error banner if API fails
- Falls back to mock data

### Events.tsx (Browse Events)

- Real-time search and filtering
- Sort by date/price
- Location filtering
- Loading states for all events
- Error handling

### Admin.tsx (Dashboard)

- Create new events with form validation
- Delete events with confirmation
- Loading states for event list
- Real-time updates after mutations
- Error messages for failed operations

## 🔧 API Client Features

The `apiClient` in `src/lib/apiClient.ts` provides:

- Automatic JSON serialization
- Error handling and formatting
- Type-safe requests with TypeScript
- Query parameter building
- Base URL configuration from environment variables

### Error Format

All errors follow a consistent format:

```typescript
{
  message: string;
  code?: string;
  details?: unknown;
}
```

## 📡 API Response Format

All API responses should follow this structure:

### Success Response

```json
{
  "data": { ... },
  "message": "Optional success message"
}
```

### Error Response

```json
{
  "message": "Error description",
  "code": "ERROR_CODE",
  "details": { ... }
}
```

## 🧪 Testing Your Backend

1. Start your Node.js backend on `http://localhost:5000`
2. The frontend will automatically connect
3. Check the Network tab in DevTools to see API calls
4. If the API is unavailable, the app will show sample data

## 🔐 Authentication (Future)

To add authentication:

1. Store auth token in localStorage or cookies
2. Modify `apiClient.ts` to include token in headers:

```typescript
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getAuthToken()}`,
  ...options.headers,
}
```

## 📝 Type Safety

All API types are defined in `src/types/api.ts`:

- `Event` - Event data structure
- `Booking` - Booking data structure
- `CreateEventRequest` - Event creation payload
- `UpdateEventRequest` - Event update payload
- `CreateBookingRequest` - Booking creation payload
- `EventsQueryParams` - Query parameters for filtering

## 🎯 Next Steps

1. **Build your Node.js backend** using the API documentation
2. **Set up your database** (MySQL) with the provided schema
3. **Configure CORS** to allow requests from your frontend
4. **Test the integration** by creating/deleting events
5. **Add authentication** for admin routes
6. **Implement booking flow** with payment integration

## 🐛 Troubleshooting

### API not connecting

- Check that `VITE_API_BASE_URL` is set correctly
- Verify your backend is running
- Check CORS configuration on backend
- Look for errors in browser console

### Type errors

- Ensure backend response format matches TypeScript types
- Check that date strings are in ISO format
- Verify ID fields are strings (frontend) even if integers (backend)

### Mutations not updating UI

- Check that query keys are consistent
- Verify `queryClient.invalidateQueries` is called
- Check React Query DevTools for cache state

## 📚 Additional Resources

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Fetch API Reference](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- Full API specification: See `API_DOCUMENTATION.md`