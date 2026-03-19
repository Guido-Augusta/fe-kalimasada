import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { fetchJuzAyat } from "@/features/santri/service/santri.service";

export const useFetchJuzOrtu = () => {
  const { idSantri, idJuz } = useParams<{ idSantri: string; idJuz: string }>();

  const query = useQuery({
    queryKey: ["juz-ayat-ortu", idSantri, idJuz],
    queryFn: () => fetchJuzAyat(idSantri!, idJuz!),
    enabled: !!idSantri && !!idJuz,
    staleTime: 5 * 60 * 1000,
  });

  return {
    juzData: query.data,
    loading: query.isLoading,
    error: query.error?.message || null,
  };
};
