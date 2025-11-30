import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { CreateEventRequest, Event, ApiResponse } from '@/types/api';
import { useToast } from '@/hooks/use-toast';

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateEventRequest) => {
      const response = await apiClient.post<ApiResponse<Event>>('/events', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: 'Event Created!',
        description: 'Your event has been successfully created and published.',
      });
    },
    onError: (error: { message: string }) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create event. Please try again.',
        variant: 'destructive',
      });
    },
  });
};
