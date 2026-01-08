import { getAuthHeaders } from "@/utils/header";
import type { ApiResponseProgress, ApiResponseReadSurah } from "../types/santri.type";

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

export const fetchSurahList = async (santriId: string): Promise<ApiResponseProgress> => {
  const headers = getAuthHeaders(false);
  const response = await fetch(
    `${BASE_URL}/api/hafalan/${santriId}/surah`,
    { headers }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch surah data.");
  }
  return response.json();
};