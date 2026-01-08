import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { verifyTokenSchema } from "../validation/auth.validation";
import { verifyResetToken, type ResetPasswordResponse } from "../service/forgot.password.service";

type VerifyTokenFormValues = z.infer<typeof verifyTokenSchema>;

export default function VerifyToken() {
  const navigate = useNavigate();
  const [isOtpReady, setIsOtpReady] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const [timerExpired, setTimerExpired] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem("forgotPasswordEmail");
    if (!email) {
      toast.error("Silakan masukkan email Anda terlebih dahulu.");
      navigate("/forgot-password");
    } else {
      const timer = setTimeout(() => {
        setIsOtpReady(true);
      }, 50);

      if (timeLeft > 0) {
        const timerInterval = setInterval(() => {
          setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);
        return () => {
          clearTimeout(timer);
          clearInterval(timerInterval);
        };
      } else {
        setTimerExpired(true);
        toast.error("Waktu untuk memasukkan token telah habis.");
        localStorage.removeItem("forgotPasswordEmail");
      }
    }
  }, [navigate, timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const verifyTokenMutation = useMutation<
    ResetPasswordResponse,
    Error,
    VerifyTokenFormValues
  >({
    mutationFn: verifyResetToken,
    onSuccess: (_data, variables) => {
      // toast.success(data.message || "Token berhasil diverifikasi.");
      toast.success("Token berhasil diverifikasi.");
      localStorage.setItem("forgotPasswordToken", variables.token);
      const endTime = Date.now() + timeLeft * 1000;
      localStorage.setItem("timerEndTime", endTime.toString());
      navigate("/set-new-password");
    },
    onError: (_error) => {
      // toast.error(error.message || "Token tidak valid atau sudah kedaluwarsa.");
      toast.error("Token tidak valid atau sudah kedaluwarsa.");
    },
  });

  const verifyTokenForm = useForm<VerifyTokenFormValues>({
    resolver: zodResolver(verifyTokenSchema),
    defaultValues: { token: "" },
  });

  const onVerifyTokenSubmit = (values: VerifyTokenFormValues) => {
    if (timerExpired) {
      toast.error("Waktu telah habis. Silakan mulai ulang proses.");
      return;
    }
    verifyTokenMutation.mutate(values);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md mx-2 md:mx-0">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-violet-600">
            Verifikasi Token
          </CardTitle>
          <CardDescription>
            Token telah dikirim ke email Anda. Masukkan token untuk melanjutkan.
          </CardDescription>
        </CardHeader>
        <CardContent>
        <div className="text-center font-bold text-lg mb-4">
          Waktu tersisa: {formatTime(timeLeft)}
        </div>
          <Form {...verifyTokenForm}>
            <form onSubmit={verifyTokenForm.handleSubmit(onVerifyTokenSubmit)} className="space-y-4" autoComplete="off">
              <FormField
                control={verifyTokenForm.control}
                name="token"
                render={({ field }) => (
                  <FormItem className="justify-center">
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        value={field.value}
                        onChange={(val) => field.onChange(val)}
                        autoComplete="one-time-code"
                        readOnly={!isOtpReady || timerExpired}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-violet-600 hover:bg-violet-700 text-white"
                disabled={verifyTokenMutation.isPending || timerExpired}
              >
                {verifyTokenMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "Verifikasi Token"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}