import { getAuthHeaders } from "@/utils/header";
import { useQuery } from "@tanstack/react-query";

const BASE_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL
  : "http://localhost:5000";

export interface SurahInfo {
  nomor: number;
  nama: string;
  nama_latin: string;
}

export interface AyatJuz {
  id: number;
  surah: SurahInfo;
  nomor_ayat: number;
  halaman: number;
  arab: string;
  latin: string;
  terjemah: string;
}

export interface JuzDetail {
  juz: number;
  mulai_dari: {
    surah: SurahInfo;
    ayat: number;
  };
  total_ayat: number;
  halaman: number[];
  ayat: AyatJuz[];
}

const fetchJuzDetail = async (juzId: number) => {
  const headers = getAuthHeaders(false);
  const url = `${BASE_URL}/api/alquran/juz/${juzId}`;

  const response = await fetch(url, {
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Gagal mengambil data juz.");
  }

  const data = await response.json();
  return data.data as JuzDetail;
};

export const useFetchJuzDetail = (juzId: number) => {
  return useQuery({
    queryKey: ["juz-detail", juzId],
    queryFn: () => fetchJuzDetail(juzId),
    staleTime: 1000 * 60 * 720,
    enabled: juzId > 0 && juzId <= 30,
  });
};
