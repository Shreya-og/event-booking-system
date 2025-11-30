import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { Event, ApiResponse } from '@/types/api';

const fetchEventById = async (id: string) => {
  if (!id) throw new Error('Event ID is required');
  const response = await apiClient.get<ApiResponse<Event>>(`/events/${id}`);
  return response.data;
};

const useEvent = (id?: string) => {
  return useQuery<Event, Error>({
    queryKey: ['event', id],
    enabled: Boolean(id),
    queryFn: async () => fetchEventById(id as string),
  });
};

export default useEvent;