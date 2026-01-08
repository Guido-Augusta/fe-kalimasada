import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import type { SantriApiPaginationData, SantriDetailData } from "../types/santri.type";
import { addSantri, deleteSantri, fetchSantri, fetchSantriDetail, updateSantri } from "../service/santri.service";

export const useSantriList = (
  page: number, 
  limit: number, 
  query: string,
  filters: { ortuId?: string; tahapHafalan?: string } = {}
) => {
  return useQuery<SantriApiPaginationData, Error>({
    queryKey: ["santri", { page, limit, query, ...filters }],
    queryFn: () => fetchSantri(page, limit, query, filters),
    placeholderData: (previousData) => previousData,
  });
};

export const useSantriDetail = (id: string) => {
  return useQuery<SantriDetailData, Error>({
    queryKey: ["santri-detail", id],
    queryFn: () => fetchSantriDetail(id),
    enabled: !!id,
  });
};

export const useAddSantriMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addSantri,
    onSuccess: () => {
      toast.success("Santri berhasil ditambahkan.");
      queryClient.invalidateQueries({ queryKey: ["santri"] });
    },
    onError: (error) => {
      if (error.message === "Email already exists") {
        toast.error("Email sudah terdaftar");
      } else if (error.message === "Nomor Induk already exists") {
        toast.error("Nomor Induk sudah terdaftar");
      } else {
        toast.error("Gagal menambahkan santri");
      }
    },
  });
};

export const useUpdateSantriMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSantri,
    onSuccess: () => {
      toast.success("Santri berhasil diperbarui.");
      queryClient.invalidateQueries({ queryKey: ["santri"] });
    },
    onError: (error) => {
      if (error.message === "Email already exists") {
        toast.error("Email sudah terdaftar");
      } else if (error.message === "Nomor Induk already exists") {
        toast.error("Nomor Induk sudah terdaftar");
      } else {
        toast.error("Gagal memperbarui santri");
      }
    },
  });
};

export const useDeleteSantriMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSantri,
    onSuccess: () => {
      toast.success("Santri berhasil dihapus.");
      queryClient.invalidateQueries({ queryKey: ["santri"] });
    },
    onError: (_error) => {
      toast.error("Gagal menghapus santri");
    },
  });
};
