import { z } from "zod";
import { loginSchema } from "../validation/auth.validation";
import useUser from "@/store/useUser";
import toast from "react-hot-toast";
import { getAuthHeaders } from "@/utils/header";

export type LoginResponse = {
  message: string;
  token: string;
  user: {
    id: string;
    roleId: string;
    email: string;
    role: string;
  };
};

const BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : "http://localhost:5000";

export const loginUser = async (values: z.infer<typeof loginSchema>): Promise<LoginResponse> => {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  });

  const data = await response.json();

  if (data.message === `Invalid credentials`) {
    throw new Error('Invalid credentials');
  }

  if (!response.ok) {
    throw new Error('Login failed');
  }
  
  return data;
};

export const logoutUser = async () => {
  localStorage.removeItem("authToken");
  useUser.getState().clearUser();
  return true;
};

export const verifyOldPassword = async (oldPassword: string) => {
  const headers = getAuthHeaders(true);
  try {
    const response = await fetch(`${BASE_URL}/api/auth/verify-old-password`, {
      method: "POST",
      headers,
      body: JSON.stringify({ oldPassword }),
    });
    await response.json();
    if (!response.ok) {
      // throw new Error(result.error || "Gagal verifikasi password lama");
      throw new Error("Gagal verifikasi password lama");
    }
    toast.success("Password lama berhasil diverifikasi");
    return true;
  } catch (error: unknown) {
    if (error instanceof Error) {
      toast.error("Gagal verifikasi password lama");
    }
    toast.error("Gagal verifikasi password lama");
    return false;
  }
};

export const changePassword = async (oldPassword: string, newPassword: string) => {
  const headers = getAuthHeaders(true);
  try {
    const response = await fetch(`${BASE_URL}/api/auth/change-password`, {
      method: "POST",
      headers,
      body: JSON.stringify({ oldPassword, newPassword }),
    });
    // const _result = await response.json();
    await response.json();
    if (!response.ok) {
      // throw new Error(result.error || "Gagal ubah password");
      throw new Error("Gagal ubah password");
    }
    toast.success("Password berhasil diubah");
    return true;
  } catch (error: unknown) {
    if (error instanceof Error) {
      toast.error("Gagal ubah password");
    }
    toast.error("Gagal ubah password");
    return false;
  }
};