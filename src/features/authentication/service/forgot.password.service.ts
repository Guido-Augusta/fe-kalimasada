import { z } from "zod";
import {
  forgotPasswordSchema,
  type setPasswordSchema,
  verifyTokenSchema,
} from "../validation/auth.validation";

export type ResetPasswordResponse = {
  message: string;
};

const BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : "http://localhost:5000";

export const sendPasswordResetEmail = async (values: z.infer<typeof forgotPasswordSchema>): Promise<ResetPasswordResponse> => {
  const response = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Gagal mengirim token. Silakan coba lagi.");
  }
  return data;
};

export const verifyResetToken = async (
  values: z.infer<typeof verifyTokenSchema>
): Promise<ResetPasswordResponse> => {
  const response = await fetch(`${BASE_URL}/api/auth/verify-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Token tidak valid atau sudah kedaluwarsa.");
  }
  return data;
};

export const setNewPasswordWithToken = async (
  values: z.infer<typeof setPasswordSchema>
): Promise<ResetPasswordResponse> => {
  const response = await fetch(`${BASE_URL}/api/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Gagal mengubah kata sandi. Silakan coba lagi.");
  }
  return data;
};