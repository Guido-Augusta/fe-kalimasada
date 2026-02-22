import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import useUser from "@/store/useUser";
import { fetchJuzAyat } from "../service/santri.service";

export const useFetchJuz = () => {
  const { user } = useUser();
  const { idJuz } = useParams<{ idJuz: string }>();
  const santriId = user?.roleId;

  const query = useQuery({
    queryKey: ["juz-ayat", santriId, idJuz],
    queryFn: () => fetchJuzAyat(santriId!, idJuz!),
    enabled: !!santriId && !!idJuz,
    staleTime: 5 * 60 * 1000,
  });

  return {
    juzData: query.data,
    loading: query.isLoading,
    error: query.error?.message || null,
  };
};
