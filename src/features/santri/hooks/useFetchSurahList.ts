import { useQuery } from "@tanstack/react-query";
import useUser from "@/store/useUser";
import { fetchProgressSurah, fetchProgressJuz } from "../service/santri.service";
import type { Surah, Juz } from "../types/santri.type";

export type ModeType = "surah" | "juz";

interface UseFetchProgressResult {
  surahData: Surah[];
  juzData: Juz[];
  loading: boolean;
  error: string | null;
}

export const useFetchProgress = (mode: ModeType): UseFetchProgressResult => {
  const { user } = useUser();
  const santriId = user?.roleId;

  const surahQuery = useQuery({
    queryKey: ["progress-surah", santriId],
    queryFn: () => fetchProgressSurah(santriId!),
    enabled: !!santriId && mode === "surah",
    staleTime: 5 * 60 * 1000,
  });

  const juzQuery = useQuery({
    queryKey: ["progress-juz", santriId],
    queryFn: () => fetchProgressJuz(santriId!),
    enabled: !!santriId && mode === "juz",
    staleTime: 5 * 60 * 1000,
  });

  const loading = mode === "surah" ? surahQuery.isLoading : juzQuery.isLoading;
  const error = mode === "surah" 
    ? surahQuery.error?.message || null 
    : juzQuery.error?.message || null;

  return {
    surahData: surahQuery.data?.data || [],
    juzData: juzQuery.data?.data || [],
    loading,
    error,
  };
};
