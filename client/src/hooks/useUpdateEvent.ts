import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { UpdateEventRequest, Event, ApiResponse } from '@/types/api';
import { useToast } from '@/hooks/use-toast';

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateEventRequest }) => {
      const response = await apiClient.put<ApiResponse<Event>>(`/events/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', variables.id] });
      toast({
        title: 'Event Updated!',
        description: 'Your event has been successfully updated.',
      });
    },
    onError: (error: { message: string }) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update event. Please try again.',
        variant: 'destructive',
      });
    },
  });
};
