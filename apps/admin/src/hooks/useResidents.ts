import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ResidentsService } from '@gatelite/api-client';

export interface Resident {
  id: string;
  name: string;
  flat: string;
  block: string;
  phone: string;
  role: 'OWNER' | 'TENANT' | 'FAMILY';
  status: 'active' | 'pending' | 'inactive';
  email?: string;
}

export interface ResidentsResponse {
  data: Resident[];
  total: number;
  page: number;
  limit: number;
}

export function useResidents(params?: {
  page?: number;
  limit?: number;
  flatId?: string;
  role?: string;
  status?: string;
}) {
  return useQuery({
    queryKey: ['residents', params],
    queryFn: async () => {
      const response = await ResidentsService.residentsControllerFindAll({
        page: params?.page?.toString() || '1',
        limit: params?.limit?.toString() || '20',
        flatId: params?.flatId || '',
        role: params?.role || '',
        status: params?.status || '',
      });
      return response as ResidentsResponse;
    },
  });
}

export function useInviteResident() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      flatId: string;
      phone: string;
      name: string;
      role?: 'OWNER' | 'TENANT' | 'FAMILY';
      isOwner?: boolean;
    }) => {
      return ResidentsService.residentsControllerInvite({ requestBody: data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['residents'] });
    },
  });
}

export function useUpdateResident() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { role?: string; status?: string; isOwner?: boolean } }) => {
      return ResidentsService.residentsControllerUpdate({ id, requestBody: data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['residents'] });
    },
  });
}

export function useRemoveResident() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return ResidentsService.residentsControllerRemove({ id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['residents'] });
    },
  });
}

export function useImportResidents() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      return ResidentsService.residentsControllerImportFromCsv();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['residents'] });
    },
  });
}