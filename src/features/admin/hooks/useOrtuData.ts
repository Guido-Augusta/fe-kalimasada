import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import type { ApiData, OrtuDetailData } from "../types/ortu.type";
import { addOrtu, deleteOrtu, fetchOrangTua, fetchOrtu, fetchOrtuDetail, updateOrtu } from "../service/ortu.service";

export const useOrtuList = (page: number, limit: number, query: string) => {
  return useQuery<ApiData, Error>({
    queryKey: ["ortu", { page, limit, query }],
    queryFn: () => fetchOrtu(page, limit, query),
    placeholderData: (previousData) => previousData,
  });
};

export const useOrtuDetail = (id: string) => {
  return useQuery<OrtuDetailData, Error>({
    queryKey: ["ortu-detail", id],
    queryFn: () => fetchOrtuDetail(id),
    enabled: !!id,
  });
};

export const useAddOrtuMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addOrtu,
    onSuccess: () => {
      toast.success("Orang tua berhasil ditambahkan.");
      queryClient.invalidateQueries({ queryKey: ["ortu"] });
    },
    onError: (error) => {
      if (error.message === "Email already exists") {
        toast.error("Email sudah terdaftar");
      } else {
        toast.error("Gagal menambahkan orang tua");
      }
    },
  });
};

export const useUpdateOrtuMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateOrtu,
    onSuccess: () => {
      toast.success("Orang tua berhasil diperbarui.");
      queryClient.invalidateQueries({ queryKey: ["ortu"] });
    },
    onError: (error) => {
      if (error.message === "Email already exists") {
        toast.error("Email sudah terdaftar");
      } else {
        toast.error("Gagal memperbarui orang tua");
      }
    },
  });
};

export const useDeleteOrtuMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteOrtu,
    onSuccess: () => {
      toast.success("Orang tua berhasil dihapus.");
      queryClient.invalidateQueries({ queryKey: ["ortu"] });
    },
    onError: (_error) => {
      toast.error("Gagal menghapus orang tua");
    },
  });
};

export const useOrangTuaList = (search: string, tipe: string) => {
  return useQuery({
    queryKey: ["orangTua", search, tipe],
    queryFn: () => fetchOrangTua(1, 200, search, tipe),
  });
};