import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRiwayatHafalan, fetchAddHafalanData, fetchProgressHafalan, fetchRiwayatDetail, fetchRiwayatTerakhir, saveHafalanData } from "../service/hafalan.service";

export const useHafalanProgressData = (idSantri: string) => {
  return useQuery({
    queryKey: ["progress-hafalan-data", idSantri],
    queryFn: () => fetchProgressHafalan(idSantri),
    enabled: !!idSantri,
  });
};

export const useFetchAddHafalanData = (
  idSantri: string,
  idSurah: string,
  mode: "tambah" | "murajaah"
) => {
  return useQuery({
    queryKey: ["addHafalanData", idSantri, idSurah, mode],
    queryFn: () => fetchAddHafalanData(idSantri, idSurah, mode),
    enabled: !!idSantri && !!idSurah,
  });
};

export const useSaveHafalan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveHafalanData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress-hafalan-data"] });
    },
    onError: (_error) => {
      // console.error("Failed to save hafalan:", error);
      alert("Gagal menyimpan hafalan")
    },
  });
};

export const useDeleteRiwayatHafalan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRiwayatHafalan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["riwayatHafalan"] });
    },
    onError: (_error) => {
      // alert(`Gagal menghapus riwayat: ${error.message}`);
      alert(`Gagal menghapus riwayat hafalan`);
    },
  });
};

export const useRiwayatDetail = (
  santriId: string,
  surahId: string,
  tanggal: string,
  status: string
) => {
  return useQuery({
    queryKey: ["riwayatDetail", santriId, surahId, tanggal, status],
    queryFn: () => fetchRiwayatDetail(santriId, surahId, tanggal, status),
    enabled: !!santriId && !!surahId && !!tanggal && !!status,
  });
};

export const useRiwayatTerakhir = (
  page: number,
  limit: number,
  status: "TambahHafalan" | "Murajaah",
  filters: { tahapHafalan?: string, name?: string, sortByAyat?: string,  } = {}
) => {
  return useQuery({
    queryKey: ["riwayatTerakhir", { page, limit, status, ...filters }],
    queryFn: () => fetchRiwayatTerakhir(page, limit, status, filters),
    enabled: !!page && !!limit && !!status,
    placeholderData: (previousData) => previousData,
  });
};
