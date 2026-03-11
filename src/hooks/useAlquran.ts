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

export interface JuzAyat {
  id: number;
  surah: {
    nomor: number;
    nama: string;
    nama_latin: string;
  };
  nomor_ayat: number;
  halaman: number | null;
  arab: string;
  latin: string;
  terjemah: string;
}

export interface JuzDetail {
  juz: number;
  mulai_dari: {
    surah: {
      nomor: number;
      nama: string;
      nama_latin: string;
    };
    ayat: number;
  };
  total_ayat: number;
  halaman: number[];
  ayat: JuzAyat[];
}

const fetchSurahListGeneral = async () => {
  const headers = getAuthHeaders(false);
  const url = `${BASE_URL}/api/alquran/surah`;

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

  return data;
};

export const useFetchJuzDetail = (juzId: number) => {
  return useQuery({
    queryKey: ["juz-detail", juzId],
    queryFn: () => fetchJuzDetail(juzId),
    staleTime: 1000 * 60 * 720
  });
};
