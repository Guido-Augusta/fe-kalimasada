import { getAuthHeaders } from "@/utils/header";

const BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : "http://localhost:5000";

export const fetchChartData = async (santriId: string, range: string) => {
  const headers = getAuthHeaders(false);
  const response = await fetch(
    `${BASE_URL}/api/chart?santriId=${santriId}&range=${range}`,
    { headers }
  );
  if (!response.ok) {
    throw new Error("Gagal mengambil data grafik.");
  }
  const result = await response.json();
  return result.data;
};