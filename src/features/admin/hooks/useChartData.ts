import { useQuery } from "@tanstack/react-query";
import { fetchChartData } from "../service/chart.service";

export const useChartData = (santriId: string, range: string, mode: string) => {
  return useQuery({
    queryKey: ["chart-data", santriId, range, mode],
    queryFn: () => fetchChartData(santriId, range, mode),
    enabled: !!santriId && !!range && !!mode,
  });
};