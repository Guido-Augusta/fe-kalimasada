import { getAuthHeaders } from "@/utils/header";
import type { ApiData, UstadzDetailData } from "../types/ustad.type";

const BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : "http://localhost:5000";

export const fetchUstadz = async (page: number, limit: number, query: string) => {
  const headers = getAuthHeaders(false);
  const response = await fetch(
      `${BASE_URL}/api/ustadz?page=${page}&limit=${limit}&search=${query}`,
      { headers }
  );
  if (!response.ok) {
      throw new Error("Gagal mengambil data ustadz.");
  }
  const result: ApiData = await response.json();
  return result;
};

export const fetchUstadzDetail = async (id: string) => {
  const headers = getAuthHeaders(false);
  const response = await fetch(`${BASE_URL}/api/ustadz/${id}`, {
      headers
  });
  if (!response.ok) {
    // const errorData = await response.json();
    throw new Error("Gagal mengambil data detail ustadz.");
  }
  const result: { data: UstadzDetailData } = await response.json();
  return result.data;
};

export const addUstadz = async (formData: FormData) => {
  const headers = getAuthHeaders(false);
  const response = await fetch(`${BASE_URL}/api/ustadz`, {
      method: "POST",
      headers,
      body: formData,
  });
  if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal mendaftarkan ustadz.");
  }
  return response.json();
};

export const updateUstadz = async ({ id, formData }: { id: string, formData: FormData }) => {
  const headers = getAuthHeaders(false);
  const response = await fetch(`${BASE_URL}/api/ustadz/${id}`, {
      method: "PUT",
      headers,
      body: formData,
  });
  if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal memperbarui data ustadz.");
  }
  return response.json();
};

export const deleteUstadz = async (id: number) => {
  const headers = getAuthHeaders(false);
  const response = await fetch(`${BASE_URL}/api/ustadz/${id}`, {
      method: "DELETE",
      headers,
  });
  if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal menghapus ustadz.");
  }
  return response.json();
};