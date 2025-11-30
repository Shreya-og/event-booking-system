import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { Event, EventsQueryParams, ApiResponse } from '@/types/api';

export const useEvents = (params?: EventsQueryParams) => {
  return useQuery({
    queryKey: ['events', params],
    queryFn: async () => {
      const queryParams: Record<string, string> = {};
      
      if (params?.search) queryParams.search = params.search;
      if (params?.location) queryParams.location = params.location;
      if (params?.dateFrom) queryParams.dateFrom = params.dateFrom;
      if (params?.dateTo) queryParams.dateTo = params.dateTo;
      if (params?.sortBy) queryParams.sortBy = params.sortBy;
      if (params?.sortOrder) queryParams.sortOrder = params.sortOrder;

      const response = await apiClient.get<ApiResponse<Event[]>>(
        '/events',
        Object.keys(queryParams).length > 0 ? queryParams : undefined
      );
      
      return response.data;
    },
  });
};
