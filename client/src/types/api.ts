// API Types and Interfaces

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string; // ISO datetime string
  totalSeats: number;
  availableSeats: number;
  price: number;
  image?: string;
}

export interface Booking {
  id: string;
  eventId: string;
  name: string;
  email: string;
  mobile: string;
  quantity: number;
  totalAmount: number;
  bookingDate: string; // ISO datetime string
  status: 'confirmed' | 'cancelled';
}

export interface CreateEventRequest {
  title: string;
  description: string;
  location: string;
  date: string;
  totalSeats: number;
  price: number;
  image?: string;
}

export interface UpdateEventRequest {
  title?: string;
  description?: string;
  location?: string;
  date?: string;
  totalSeats?: number;
  availableSeats?: number;
  price?: number;
  image?: string;
}

export interface CreateBookingRequest {
  eventId: string;
  name: string;
  email: string;
  mobile: string;
  quantity: number;
}

export interface EventsQueryParams {
  search?: string;
  location?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'date' | 'price' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
