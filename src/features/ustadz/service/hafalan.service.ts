import { getAuthHeaders } from '@/utils/header';
import type {
  DeleteRiwayatHafalanResponse,
  HafalanData,
  HafalanProgressApiData,
  JuzHafalanData,
  RiwayatDetailResponse,
  RiwayatHafalanResponse,
  RiwayatHafalanTerakhirResponse,
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
  mode: 'tambah' | 'murajaah'
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
  mode: 'tambah' | 'murajaah'
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
  estudiantId: number;
  ayatIds: number[];
  status: 'TambahHafalan' | 'Murajaah';
  catatan: string;
}) => {
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
};

export const saveHafalanByHalaman = async (payload: {
  estudiantilId: number;
  halamanAwal: number;
  halamanAkhir: number;
  status: 'TambahHafalan' | 'Murajaah';
  catatan: string;
}) => {
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
};

export const deleteRiwayatHafalan = async (data: {
  santriId: number;
  surahId: number;
  tanggal: string;
  status: 'TambahHafalan' | 'Murajaah';
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
  santriId: string,
  page: number,
  status: 'TambahHafalan' | 'Murajaah'
): Promise<RiwayatHafalanResponse> => {
  const headers = getAuthHeaders(false);
  let url = `${BASE_URL}/api/hafalan/riwayat/${santriId}?page=${page}&limit=10`;
  if (status === 'TambahHafalan' || status === 'Murajaah') {
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
  const url = `${BASE_URL}/api/hafalan/riwayat/detail/${santriId}/surah/${surahId}?tanggal=${tanggal}&status=${status}`;
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
  status: 'TambahHafalan' | 'Murajaah',
  filters: { tahapHafalan?: string; name?: string; sortByAyat?: string } = {}
): Promise<RiwayatHafalanTerakhirResponse> => {
  const headers = getAuthHeaders(false);
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    status: status,
    ...filters,
  });
  const url = `${BASE_URL}/api/hafalan/all-santri/latest?${params.toString()}`;
  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error('Gagal mengambil data riwayat terakhir');
  }
  const result: RiwayatHafalanTerakhirResponse = await response.json();
  return result;
};
