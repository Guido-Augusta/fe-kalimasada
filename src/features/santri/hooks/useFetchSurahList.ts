import { useState, useEffect } from "react";
import useUser from "@/store/useUser";
import { fetchSurahList } from "../service/santri.service";
import type { Surah } from "../types/santri.type";

export const useFetchSurahList = () => {
  const { user } = useUser();
  const [surahData, setSurahData] = useState<Surah[]>([]);
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
        const result = await fetchSurahList(user.roleId);
        setSurahData(result.data);
      } catch (_err) {
        setError("An error occurred while fetching data.");
        // console.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [user?.roleId]);

  return { surahData, loading, error };
};