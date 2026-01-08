import { getAuthHeaders } from "@/utils/header";

const BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : "http://localhost:5000";

export const updateProfileOrtu = async ({ id, formData }: { id: string, formData: FormData }) => {
  const headers = getAuthHeaders(false);
  // console.log(formData);
  const response = await fetch(`${BASE_URL}/api/ortu/${id}`, {
    method: "PUT",
    headers,
    body: formData,
  });
  if (!response.ok) {
    // const _errorData = await response.json();
    await response.json();
    // throw new Error(errorData.message || "Gagal memperbarui data ortu.");
    throw new Error("Gagal memperbarui data orang tua.");
  }
  return response.json();
};