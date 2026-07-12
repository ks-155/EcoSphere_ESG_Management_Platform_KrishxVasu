import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { QueryParams } from "@/types/api";
import { toast } from "@/components/ui/use-toast";

interface CrudApi<T> {
  list: (params?: QueryParams) => Promise<any>;
  getById: (id: string) => Promise<T>;
  create: (data: Partial<T>) => Promise<T>;
  update: (id: string, data: Partial<T>) => Promise<T>;
  remove: (id: string) => Promise<void>;
}

export function createCrudHooks<T>(resourceKey: string, api: CrudApi<T>) {
  const queryKey = resourceKey;

  function useList(params?: QueryParams) {
    return useQuery({
      queryKey: [queryKey, "list", params],
      queryFn: () => api.list(params),
    });
  }

  function useGetById(id: string) {
    return useQuery({
      queryKey: [queryKey, id],
      queryFn: () => api.getById(id),
      enabled: !!id,
    });
  }

  function useCreate() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (data: Partial<T>) => api.create(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
        toast({ title: "Created successfully", variant: "success" });
      },
      onError: (error: any) => {
        toast({
          title: "Failed to create",
          description: error?.response?.data?.message || "An error occurred",
          variant: "destructive",
        });
      },
    });
  }

  function useUpdate() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: Partial<T> }) =>
        api.update(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
        toast({ title: "Updated successfully", variant: "success" });
      },
      onError: (error: any) => {
        toast({
          title: "Failed to update",
          description: error?.response?.data?.message || "An error occurred",
          variant: "destructive",
        });
      },
    });
  }

  function useDelete() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (id: string) => api.remove(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
        toast({ title: "Deleted successfully", variant: "success" });
      },
      onError: (error: any) => {
        toast({
          title: "Failed to delete",
          description: error?.response?.data?.message || "An error occurred",
          variant: "destructive",
        });
      },
    });
  }

  return { useList, useGetById, useCreate, useUpdate, useDelete };
}
