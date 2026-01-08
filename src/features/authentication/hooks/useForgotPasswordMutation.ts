import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import {
  forgotPasswordSchema,
  setPasswordSchema,
  verifyTokenSchema,
} from "../validation/auth.validation";
import {
  sendPasswordResetEmail,
  verifyResetToken,
  setNewPasswordWithToken,
  type ResetPasswordResponse,
} from "../service/forgot.password.service";

type ForgotFormValues = z.infer<typeof forgotPasswordSchema>;
type VerifyTokenFormValues = z.infer<typeof verifyTokenSchema>;
type ResetFormValues = z.infer<typeof setPasswordSchema>;

export const useResetPasswordMutation = () => {
  const navigate = useNavigate();

  const forgotPasswordMutation = useMutation<
    ResetPasswordResponse,
    Error,
    ForgotFormValues
  >({
    mutationFn: sendPasswordResetEmail,
    onSuccess: (_data) => {
      // toast.success(data.message || "Token berhasil dikirim ke email Anda.");
      toast.success("Token berhasil dikirim ke email Anda.");
    },
    onError: (_error) => {
      // toast.error(error.message || "Gagal mengirim token. Silakan coba lagi.");
      toast.error("Gagal mengirim token. Silakan coba lagi.");
    },
  });

  const verifyTokenMutation = useMutation<
    ResetPasswordResponse,
    Error,
    VerifyTokenFormValues
  >({
    mutationFn: verifyResetToken,
    onSuccess: (_data) => {
      // toast.success(data.message || "Token berhasil diverifikasi.");
      toast.success("Token berhasil diverifikasi.");
    },
    onError: (_error) => {
      // toast.error(error.message || "Token tidak valid atau sudah kedaluwarsa.");
      toast.error("Token tidak valid atau sudah kedaluwarsa.");
    },
  });

  const setNewPasswordMutation = useMutation<
    ResetPasswordResponse,
    Error,
    ResetFormValues
  >({
    mutationFn: setNewPasswordWithToken,
    onSuccess: (_data) => {
      // toast.success(data.message || "Kata sandi berhasil diubah.");
      toast.success("Kata sandi berhasil diubah.");
      navigate("/login");
    },
    onError: (_error) => {
      // toast.error(error.message || "Gagal mengubah kata sandi. Silakan coba lagi.");
      toast.error("Gagal mengubah kata sandi. Silakan coba lagi.");
    },
  });

  return { forgotPasswordMutation, verifyTokenMutation, setNewPasswordMutation };
};