import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { setPasswordSchema } from "../validation/auth.validation";
import { setNewPasswordWithToken, type ResetPasswordResponse } from "../service/forgot.password.service";

type ResetFormValues = z.infer<typeof setPasswordSchema>;

export default function SetNewPassword() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerExpired, setTimerExpired] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("forgotPasswordToken");
    const timerEndTime = localStorage.getItem("timerEndTime");

    if (!token) {
      toast.error("Silakan verifikasi token Anda terlebih dahulu.");
      navigate("/verify-token");
    }

    if (timerEndTime) {
      const remainingTime = Math.max(0, Math.floor((parseInt(timerEndTime) - Date.now()) / 1000));
      setTimeLeft(remainingTime);
      if (remainingTime <= 0) {
        setTimerExpired(true);
        toast.error("Waktu telah habis. Silakan mulai ulang proses.");
      } else {
        const timerInterval = setInterval(() => {
          setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);
        return () => clearInterval(timerInterval);
      }
    }
  }, [navigate]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const resetPasswordMutation = useMutation<
    ResetPasswordResponse,
    Error,
    ResetFormValues
  >({
    mutationFn: setNewPasswordWithToken,
    onSuccess: (_data) => {
      // toast.success(data.message || "Kata sandi berhasil diubah.");
      toast.success("Kata sandi berhasil diubah.");
      localStorage.removeItem("forgotPasswordEmail");
      localStorage.removeItem("forgotPasswordToken");
      localStorage.removeItem("timerEndTime");
      navigate("/login");
    },
    onError: (_error) => {
      // toast.error(error.message || "Gagal mengubah kata sandi. Silakan coba lagi.");
      toast.error("Gagal mengubah kata sandi. Silakan coba lagi.");
    },
  });

  const resetForm = useForm<Omit<ResetFormValues, 'token'>>({
    resolver: zodResolver(setPasswordSchema.omit({token: true})),
    defaultValues: { newPassword: "" },
  });

  const onResetSubmit = (values: Omit<ResetFormValues, 'token'>) => {
    if (timerExpired) {
      toast.error("Waktu telah habis. Silakan mulai ulang proses.");
      return;
    }
    const token = localStorage.getItem("forgotPasswordToken");
    if (!token) {
      toast.error("Token tidak ditemukan. Silakan mulai ulang proses.");
      navigate("/forgot-password");
      return;
    }
    resetPasswordMutation.mutate({ ...values, token });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md mx-2 md:mx-0">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-violet-600">
            Ubah Kata Sandi
          </CardTitle>
          <CardDescription>
            Masukkan kata sandi baru Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center font-bold text-lg mb-4">
            Waktu tersisa: {formatTime(timeLeft)}
          </div>
          <Form {...resetForm}>
            <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4">
              <FormField
                control={resetForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kata Sandi Baru</FormLabel>
                    <FormControl>
                        {/* <Input type="password" placeholder="••••••••" {...field} autoComplete="new-password" disabled={timerExpired} /> */}
                      <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••" {...field} autoComplete="new-password" disabled={timerExpired}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-violet-600 hover:bg-violet-700 text-white"
                disabled={resetPasswordMutation.isPending || timerExpired}
              >
                {resetPasswordMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "Ubah Kata Sandi"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}