import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { Booking, ApiResponse } from '@/types/api';

export const useBookings = (eventId?: string) => {
  return useQuery({
    queryKey: ['bookings', eventId],
    queryFn: async () => {
      const endpoint = eventId ? `/bookings?eventId=${eventId}` : '/bookings';
      const response = await apiClient.get<ApiResponse<Booking[]>>(endpoint);
      return response.data;
    },
  });
};
