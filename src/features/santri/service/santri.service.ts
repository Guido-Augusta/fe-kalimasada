import { getAuthHeaders } from "@/utils/header";
import type { ApiResponseProgressJuz, ApiResponseProgressSurah, ApiResponseReadSurah } from "../types/santri.type";

const BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : "http://localhost:5000";

export const fetchSurahAyat = async (santriId: string, idSurah: string): Promise<ApiResponseReadSurah> => {
  const headers = getAuthHeaders(false);
  const response = await fetch(
    `${BASE_URL}/api/hafalan/${santriId}/surah/${idSurah}?mode=tambah`,
    { headers }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch surah ayat.");
  }
  return response.json();
};

export const fetchProgressSurah = async (santriId: string): Promise<ApiResponseProgressSurah> => {
  const headers = getAuthHeaders(false);
  const response = await fetch(
    `${BASE_URL}/api/hafalan/${santriId}?mode=surah`,
    { headers }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch surah data.");
  }
  return response.json();
};

export const fetchProgressJuz = async (santriId: string): Promise<ApiResponseProgressJuz> => {
  const headers = getAuthHeaders(false);
  const response = await fetch(
    `${BASE_URL}/api/hafalan/${santriId}?mode=juz`,
    { headers }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch juz data.");
  }
  return response.json();
};