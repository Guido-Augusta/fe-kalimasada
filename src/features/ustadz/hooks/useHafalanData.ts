import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  deleteRiwayatHafalan,
  fetchAddHafalanData,
  fetchJuzHafalanData,
  fetchProgressHafalan,
  fetchRiwayatDetail,
  fetchRiwayatJuzDetail,
  fetchRiwayatTerakhir,
  saveHafalanData,
  saveHafalanByHalaman,
} from '../service/hafalan.service';
import type { HafalanMode, HafalanStatus } from '../types/hafalan.type';

export const useHafalanProgressData = (
  idSantri: string,
  mode: 'surah' | 'juz' = 'surah'
) => {
  return useQuery({
    queryKey: ['progress-hafalan-data', idSantri, mode],
    queryFn: () => fetchProgressHafalan(idSantri, mode),
    enabled: !!idSantri,
  });
};

export const useFetchAddHafalanData = (
  idSantri: string,
  idSurah: string,
  mode: HafalanMode
) => {
  return useQuery({
    queryKey: ['addHafalanData', idSantri, idSurah, mode],
    queryFn: () => fetchAddHafalanData(idSantri, idSurah, mode),
    enabled: !!idSantri && !!idSurah,
  });
};

export const useFetchJuzHafalanData = (
  idSantri: string,
  idJuz: string,
  mode: HafalanMode
) => {
  return useQuery({
    queryKey: ['juzHafalanData', idSantri, idJuz, mode],
    queryFn: () => fetchJuzHafalanData(idSantri, idJuz, mode),
    enabled: !!idSantri && !!idJuz,
  });
};

export const useSaveHafalan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveHafalanData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress-hafalan-data'] });
    },
    onError: (_error) => {
      // console.error("Failed to save hafalan:", error);
      alert('Gagal menyimpan hafalan');
    },
  });
};

export const useSaveHafalanByHalaman = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveHafalanByHalaman,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress-hafalan-data'] });
    },
    onError: (_error) => {
      alert('Gagal menyimpan hafalan');
    },
  });
};

export const useDeleteRiwayatHafalan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRiwayatHafalan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['riwayatHafalan'] });
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
    queryKey: ['riwayatDetail', santriId, surahId, tanggal, status],
    queryFn: () => fetchRiwayatDetail(santriId, surahId, tanggal, status),
    enabled: !!santriId && !!surahId && !!tanggal && !!status,
  });
};

export const useRiwayatTerakhir = (
  page: number,
  limit: number,
  status: HafalanStatus,
  filters: { tahapHafalan?: string; name?: string; sortByAyat?: string; sortByHalaman?: string; mode?: 'surah' | 'juz' } = {}
) => {
  return useQuery({
    queryKey: ['riwayatTerakhir', { page, limit, status, ...filters }],
    queryFn: () => fetchRiwayatTerakhir(page, limit, status, filters),
    enabled: !!page && !!limit && !!status,
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
};

export const useRiwayatJuzDetail = (
  santriId: string,
  juzId: string,
  tanggal: string,
  status: string
) => {
  return useQuery({
    queryKey: ['riwayatJuzDetail', santriId, juzId, tanggal, status],
    queryFn: () => fetchRiwayatJuzDetail(santriId, juzId, tanggal, status),
    enabled: !!santriId && !!juzId && !!tanggal && !!status,
  });
};
