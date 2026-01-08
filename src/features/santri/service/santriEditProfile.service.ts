import { getAuthHeaders } from "@/utils/header";

const BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : "http://localhost:5000";

export const updateProfileSantri = async ({ id, formData }: { id: string, formData: FormData }) => {
  const headers = getAuthHeaders(false);
  const response = await fetch(`${BASE_URL}/api/santri/${id}`, {
    method: "PUT",
    headers,
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Gagal memperbarui Profile.");
  }
  return response.json();
};