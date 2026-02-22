import { useState, useEffect } from "react";
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
  const [surahData, setSurahData] = useState<Surah[]>([]);
  const [juzData, setJuzData] = useState<Juz[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      if (!user?.roleId) {
        setError("Santri ID is not available.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        if (mode === "surah") {
          const result = await fetchProgressSurah(user.roleId);
          setSurahData(result.data);
        } else {
          const result = await fetchProgressJuz(user.roleId);
          setJuzData(result.data);
        }
      } catch (_err) {
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [user?.roleId, mode]);

  return { surahData, juzData, loading, error };
};
