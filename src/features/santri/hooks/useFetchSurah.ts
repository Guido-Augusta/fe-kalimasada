import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useUser from "@/store/useUser";
import { fetchSurahAyat } from "../service/santri.service";
import type { ApiResponseReadSurah } from "../types/santri.type";

export const useFetchSurah = () => {
  const { user } = useUser();
  const { idSurah } = useParams<{ idSurah: string }>();
  const [surahData, setSurahData] = useState<ApiResponseReadSurah | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      if (!user?.roleId || !idSurah) {
        setError("Santri ID or Surah ID is not available.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const result = await fetchSurahAyat(user.roleId, idSurah);
        setSurahData(result);
      } catch (_err) {
        setError("An error occurred while fetching data.");
        // console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [user?.roleId, idSurah]);

  return { surahData, loading, error };
};