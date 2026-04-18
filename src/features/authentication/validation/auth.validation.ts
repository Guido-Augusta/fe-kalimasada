import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().min(1, {
        message: "Email atau Nama Santri harus diisi"
    }),
    password: z.string().min(8, {
        message: "Kata sandi minimal 8 karakter"
    }),
    platform: z.string().default("web").optional()
})

export const forgotPasswordSchema = z.object({
  email: z.string().email({
    message: "Email tidak valid",
  }),
});

export const verifyTokenSchema = z.object({
  token: z.string().min(6, {
    message: "Token harus 6 digit",
  }),
});

export const setPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(8, {
    message: "Kata sandi minimal 8 karakter",
  }),
});

export const verifyPasswordSchema = z.object({
  oldPassword: z.string().min(8, "Password minimal 8 karakter"),
});

export const changePasswordSchema = z.object({
  newPassword: z.string().min(8, "Password minimal 8 karakter"),
});