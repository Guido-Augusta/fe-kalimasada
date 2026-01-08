import { useQuery } from "@tanstack/react-query";
import { fetchChartData } from "../service/chart.service";

export const useChartData = (santriId: string, range: string) => {
  return useQuery({
    queryKey: ["chart-data", santriId, range],
    queryFn: () => fetchChartData(santriId, range),
    enabled: !!santriId && !!range,
  });
};