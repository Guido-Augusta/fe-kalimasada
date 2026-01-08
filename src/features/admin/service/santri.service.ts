import { getAuthHeaders } from "@/utils/header";
import type { SantriApiPaginationData, SantriDetailData } from "../types/santri.type";

const BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : "http://localhost:5000";

export const fetchSantri = async (
  page: number, 
  limit: number, 
  search: string,
  filters: { ortuId?: string; tahapHafalan?: string } = {}
) => {
  const headers = getAuthHeaders(false);
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    search: search,
    ...filters
  });
  const response = await fetch(
    `${BASE_URL}/api/santri?${params.toString()}`,
    { headers }
  );
  if (!response.ok) {
    throw new Error("Gagal mengambil data santri.");
  }
  const result: SantriApiPaginationData = await response.json();
  return result;
};

export const fetchSantriDetail = async (id: string) => {
  const headers = getAuthHeaders(false);
  const response = await fetch(`${BASE_URL}/api/santri/${id}`, {
    headers
  });
  if (!response.ok) {
    throw new Error("Gagal mengambil data detail santri.");
  }
  const result: { data: SantriDetailData } = await response.json();
  return result.data;
};

export const addSantri = async (formData: FormData) => {
  const headers = getAuthHeaders(false);
  const response = await fetch(`${BASE_URL}/api/santri`, {
    method: "POST",
    headers,
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Gagal mendaftarkan santri.");
  }
  return response.json();
};

export const updateSantri = async ({ id, formData }: { id: string, formData: FormData }) => {
  const headers = getAuthHeaders(false);
  const response = await fetch(`${BASE_URL}/api/santri/${id}`, {
    method: "PUT",
    headers,
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Gagal memperbarui data santri.");
  }
  return response.json();
};

export const deleteSantri = async (id: number) => {
  const headers = getAuthHeaders(false);
  const response = await fetch(`${BASE_URL}/api/santri/${id}`, {
    method: "DELETE",
    headers,
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Gagal menghapus santri.");
  }
  return response.json();
};
