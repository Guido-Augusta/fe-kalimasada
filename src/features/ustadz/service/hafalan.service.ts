import { getAuthHeaders } from '@/utils/header';
import type {
  DeleteRiwayatHafalanResponse,
  HafalanData,
  HafalanMode,
  HafalanProgressApiData,
  HafalanStatus,
  JuzHafalanData,
  RiwayatDetailResponse,
  RiwayatHafalanResponse,
  RiwayatHafalanTerakhirResponse,
  RiwayatJuzDetailResponse,
  SaveHafalanResponse,
} from '../types/hafalan.type';

const BASE_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL
  : 'http://localhost:5000';

export const fetchProgressHafalan = async (
  idSantri: string,
  mode: 'surah' | 'juz' = 'surah'
) => {
  const headers = getAuthHeaders(false);
  const response = await fetch(
    `${BASE_URL}/api/hafalan/${idSantri}?mode=${mode}`,
    { headers }
  );
  if (!response.ok) {
    throw new Error('Gagal mengambil data hafalan.');
  }
  const result: HafalanProgressApiData = await response.json();
  return result;
};

export const fetchAddHafalanData = async (
  idSantri: string,
  idSurah: string,
  mode: HafalanMode
) => {
  const headers = getAuthHeaders(true);
  const response = await fetch(
    `${BASE_URL}/api/hafalan/${idSantri}/surah/${idSurah}?mode=${mode}`,
    { headers }
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Gagal mengambil data hafalan.');
  }
  const result: HafalanData = await response.json();
  return result;
};

export const fetchJuzHafalanData = async (
  idSantri: string,
  idJuz: string,
  mode: HafalanMode
) => {
  const headers = getAuthHeaders(true);
  const response = await fetch(
    `${BASE_URL}/api/hafalan/${idSantri}/juz/${idJuz}?mode=${mode}`,
    { headers }
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Gagal mengambil data hafalan juz.');
  }
  const result: JuzHafalanData = await response.json();
  return result;
};

export const saveHafalanData = async (payload: {
  santriId: number;
  ayatIds: number[];
  status: HafalanStatus;
  catatan: string;
  kualitas?: string;
  keterangan?: string;
}): Promise<SaveHafalanResponse> => {
  const headers = getAuthHeaders(true);
  const response = await fetch(`${BASE_URL}/api/hafalan/ayat`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Gagal menyimpan hafalan.');
  }

  return response.json();
};

export const saveHafalanByHalaman = async (payload: {
  santriId: number;
  halamanAwal: number;
  halamanAkhir: number;
  status: HafalanStatus;
  catatan: string;
  kualitas?: string;
  keterangan?: string;
}): Promise<SaveHafalanResponse> => {
  const headers = getAuthHeaders(true);
  const response = await fetch(`${BASE_URL}/api/hafalan/halaman`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Gagal menyimpan hafalan.');
  }

  return response.json();
};

export const deleteRiwayatHafalan = async (data: {
  santriId: number;
  surahId?: number;
  juzId?: number;
  tanggal: string;
  status: HafalanStatus;
}): Promise<DeleteRiwayatHafalanResponse> => {
  const headers = getAuthHeaders(true);
  const response = await fetch(`${BASE_URL}/api/hafalan/riwayat`, {
    method: 'DELETE',
    headers,
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Gagal menghapus riwayat hafalan');
  }
  return response.json();
};

export const fetchRiwayatHafalan = async (
  siswaId: string,
  page: number,
  status: HafalanStatus,
  mode: 'ayat' | 'halaman' = 'ayat'
): Promise<RiwayatHafalanResponse> => {
  const headers = getAuthHeaders(false);
  let url = `${BASE_URL}/api/hafalan/riwayat/${siswaId}?page=${page}&limit=10&mode=${mode}`;
  if (status === 'TambahHafalan' || status === 'Murajaah' || status === 'Tahsin') {
    url += `&status=${status}`;
  }
  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error('Gagal mengambil data riwayat hafalan');
  }
  return response.json();
};

export const fetchRiwayatDetail = async (
  santriId: string,
  surahId: string,
  tanggal: string,
  status: string
): Promise<RiwayatDetailResponse> => {
  const headers = getAuthHeaders(false);
  const url = `${BASE_URL}/api/hafalan/riwayat/detail/${santriId}/surah/${surahId}?status=${status}&tanggal=${tanggal}`;
  const response = await fetch(url, { headers });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || 'Gagal mengambil detail riwayat hafalan.'
    );
  }
  return response.json();
};

export const fetchRiwayatTerakhir = async (
  page: number,
  limit: number,
  status: HafalanStatus,
  filters: { tahapHafalan?: string; name?: string; sortByAyat?: string; sortByHalaman?: string; mode?: 'surah' | 'juz' } = {}
): Promise<RiwayatHafalanTerakhirResponse> => {
  const headers = getAuthHeaders(false);
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    status: status,
    mode: filters.mode || 'surah',
  });

  if (filters.tahapHafalan) params.append('tahapHafalan', filters.tahapHafalan);
  if (filters.name) params.append('name', filters.name);
  if (filters.sortByAyat) params.append('sortByAyat', filters.sortByAyat);
  if (filters.sortByHalaman) params.append('sortByHalaman', filters.sortByHalaman);

  const url = `${BASE_URL}/api/hafalan/all-santri/latest?${params.toString()}`;
  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error('Gagal mengambil data riwayat terakhir');
  }
  const result: RiwayatHafalanTerakhirResponse = await response.json();
  return result;
};

export const fetchRiwayatJuzDetail = async (
  santriId: string,
  juzId: string,
  tanggal: string,
  status: string
): Promise<RiwayatJuzDetailResponse> => {
  const headers = getAuthHeaders(false);
  const url = `${BASE_URL}/api/hafalan/riwayat/detail/${santriId}/juz/${juzId}?status=${status}&tanggal=${tanggal}`;
  const response = await fetch(url, { headers });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || 'Gagal mengambil detail riwayat hafalan juz.'
    );
  }
  return response.json();
};
