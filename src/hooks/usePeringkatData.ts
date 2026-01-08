import { getAuthHeaders } from "@/utils/header";
import { useQuery } from "@tanstack/react-query";

const BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : "http://localhost:5000";

interface PeringkatSantri {
  id: number;
  nama: string;
  totalPoin: number;
  peringkat: number;
  tahapHafalan: string;
  fotoProfil: string;
}

interface PeringkatResponse {
  message: string;
  status: number;
  pagination: {
    page: number;
    limit: number;
    totalData: number;
    totalPages: number;
  };
  data: PeringkatSantri[];
}

const fetchPeringkat = async (page: number, limit: number, search: string, tahapHafalan: string): Promise<PeringkatResponse> => {
  const headers = getAuthHeaders(false);
  const url = new URL(`${BASE_URL}/api/santri/peringkat`);
  url.searchParams.append("page", page.toString());
  url.searchParams.append("limit", limit.toString());
  if (search) {
    url.searchParams.append("search", search);
  }
  if (tahapHafalan) {
    url.searchParams.append("tahapHafalan", tahapHafalan);
  }

  const response = await fetch(
    url.toString(),
    { headers }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Gagal mengambil data peringkat.");
  }

  return response.json();
};

export const usePeringkatData = (page: number, limit: number, search: string, tahapHafalan: string) => {
  return useQuery({
    queryKey: ["peringkat", page, limit, search, tahapHafalan],
    queryFn: () => fetchPeringkat(page, limit, search, tahapHafalan),
  });
};