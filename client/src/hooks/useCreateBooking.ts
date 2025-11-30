import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { CreateBookingRequest, Booking, ApiResponse } from '@/types/api';
import { useToast } from '@/hooks/use-toast';

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateBookingRequest) => {
      const response = await apiClient.post<ApiResponse<Booking>>('/bookings', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: 'Booking Confirmed!',
        description: 'Your tickets have been successfully booked.',
      });
    },
    onError: (error: { message: string }) => {
      toast({
        title: 'Booking Failed',
        description: error.message || 'Failed to book tickets. Please try again.',
        variant: 'destructive',
      });
    },
  });
};
