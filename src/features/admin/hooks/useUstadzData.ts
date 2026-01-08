import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import type { ApiData, UstadzDetailData } from "../types/ustad.type";
import { addUstadz, deleteUstadz, fetchUstadz, fetchUstadzDetail, updateUstadz } from "../service/ustadz.service";

export const useUstadzList = (page: number, limit: number, query: string) => {
    return useQuery<ApiData, Error>({
        queryKey: ["ustadz", { page, limit, query }],
        queryFn: () => fetchUstadz(page, limit, query),
        placeholderData: (previousData) => previousData,
    });
};

export const useUstadzDetail = (id: string) => {
    return useQuery<UstadzDetailData, Error>({
        queryKey: ["ustadz-detail", id],
        queryFn: () => fetchUstadzDetail(id),
        enabled: !!id,
    });
};

export const useAddUstadzMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addUstadz,
        onSuccess: () => {
            toast.success("Ustadz berhasil didaftarkan.");
            queryClient.invalidateQueries({ queryKey: ['ustadz'] });
        },
        onError: (error) => {
          if (error.message === "Email already exists") {
            toast.error("Email sudah terdaftar");
          } else {
            toast.error("Gagal mendaftarkan ustadz");
          }
        },
    });
};

export const useUpdateUstadzMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateUstadz,
        onSuccess: () => {
            toast.success("Data ustadz berhasil diperbarui.");
            queryClient.invalidateQueries({ queryKey: ['ustadz-detail'] });
            queryClient.invalidateQueries({ queryKey: ['ustadz'] });
        },
        onError: (error) => {
          if (error.message === "Email already exists") {
            toast.error("Email sudah terdaftar");
          } else {
            toast.error("Gagal memperbarui ustadz");
          }
        },
    });
};

export const useDeleteUstadzMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteUstadz,
        onSuccess: () => {
            toast.success("Ustadz berhasil dihapus.");
            queryClient.invalidateQueries({ queryKey: ['ustadz'] });
        },
        onError: (_err) => {
            toast.error("Gagal menghapus ustadz");
        },
    });
};