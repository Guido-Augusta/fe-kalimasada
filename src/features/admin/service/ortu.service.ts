import { getAuthHeaders } from "@/utils/header";
import type { ApiData, OrtuDetailData } from "../types/ortu.type";

const BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : "http://localhost:5000";

export const fetchOrtu = async (page?: number, limit?: number, query?: string) => {
  const headers = getAuthHeaders(false);
  const response = await fetch(
    `${BASE_URL}/api/ortu?page=${page}&limit=${limit}&search=${query}`,
    { headers }
  );
  if (!response.ok) {
    throw new Error("Gagal mengambil data ortu.");
  }
  const result: ApiData = await response.json();
  return result;
};

export const fetchOrtuDetail = async (id: string) => {
  const headers = getAuthHeaders(false);
  const response = await fetch(`${BASE_URL}/api/ortu/${id}`, {
    headers
  });
  if (!response.ok) {
    throw new Error("Gagal mengambil data detail ortu.");
  }
  const result: { data: OrtuDetailData } = await response.json();
  return result.data;
};

export const addOrtu = async (formData: FormData) => {
  const headers = getAuthHeaders(false);
  const response = await fetch(`${BASE_URL}/api/ortu`, {
    method: "POST",
    headers,
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Gagal mendaftarkan ortu.");
  }
  return response.json();
};

export const updateOrtu = async ({ id, formData }: { id: string, formData: FormData }) => {
  const headers = getAuthHeaders(false);
  const response = await fetch(`${BASE_URL}/api/ortu/${id}`, {
    method: "PUT",
    headers,
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Gagal memperbarui data ortu.");
  }
  return response.json();
};

export const deleteOrtu = async (id: number) => {
  const headers = getAuthHeaders(false);
  const response = await fetch(`${BASE_URL}/api/ortu/${id}`, {
    method: "DELETE",
    headers,
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Gagal menghapus ortu.");
  }
  return response.json();
};

export const fetchOrangTua = async (page = 1, limit = 100, search = "", tipe = "") => {
  const headers = getAuthHeaders(false);
  const response = await fetch(
    `${BASE_URL}/api/ortu?page=${page}&limit=${limit}&search=${search}&tipe=${tipe}`,
    { headers }
  );
  if (!response.ok) {
    throw new Error("Gagal mengambil data orang tua.");
  }
  const result = await response.json();
  return result.data;
};