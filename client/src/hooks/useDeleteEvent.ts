import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { ApiResponse } from '@/types/api';
import { useToast } from '@/hooks/use-toast';

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete<ApiResponse<void>>(`/events/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: 'Event Deleted',
        description: 'The event has been successfully deleted.',
      });
    },
    onError: (error: { message: string }) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete event. Please try again.',
        variant: 'destructive',
      });
    },
  });
};
