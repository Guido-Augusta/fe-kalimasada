import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchSurahAyat } from "@/features/santri/service/santri.service";
import type { ApiResponseReadSurah } from "@/features/santri/types/santri.type";

export const useFetchSurahOrtu = () => {
  const { idSantri, idSurah } = useParams<{ idSantri: string; idSurah: string }>();
  const [surahData, setSurahData] = useState<ApiResponseReadSurah | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      if (!idSantri || !idSurah) {
        setError("Santri ID or Surah ID is not available.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const result = await fetchSurahAyat(idSantri, idSurah);
        setSurahData(result);
      } catch (_err) {
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [idSantri, idSurah]);

  return { surahData, loading, error };
};
