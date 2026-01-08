import { getAuthHeaders } from "@/utils/header";
import { useQuery } from "@tanstack/react-query";

const BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : "http://localhost:5000";

export interface SurahGeneral {
  id: number;
  nomor: number;
  nama: string;
  namaLatin: string;
  totalAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
}

export interface surahDetail {
  status: boolean;
  nomor: number;
  nama: string;
  jumlah_ayat: number;
  nama_latin: string;
  arti: string;
  tempat_turun: string;
  deskripsi: string;
  audio: string;
  ayat: Array<{
    id: number;
    surah: number;
    nomor: number;
    ar: string;
    tr: string;
    idn: string;
    juz: number;
  }>;
}

const fetchSurahListGeneral = async () => {
  const headers = getAuthHeaders(false);
  const url = `${BASE_URL}/api/alquran`;

  const response = await fetch(url, {
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Gagal mengambil data surah.");
  }

  const data = await response.json();

  return data;
};

export const useFetchSurahListGeneral = () => {
  return useQuery({
    queryKey: ["surah-list-general"],
    queryFn: fetchSurahListGeneral,
    staleTime: 1000 * 60 * 720
  });
};

const fetchSurahDetail = async (nomor: number) => {
  const headers = getAuthHeaders(false);
  const url = `${BASE_URL}/api/alquran/surah/${nomor}`;

  const response = await fetch(url, {
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Gagal mengambil data surah.");
  }

  const data = await response.json();

  return data;
};

export const useFetchSurahDetail = (nomor: number) => {
  return useQuery({
    queryKey: ["surah-detail", nomor],
    queryFn: () => fetchSurahDetail(nomor),
    staleTime: 1000 * 60 * 720
  });
};
