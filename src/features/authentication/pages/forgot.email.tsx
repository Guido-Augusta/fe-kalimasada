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
import { Loader2 } from "lucide-react";
import { forgotPasswordSchema } from "../validation/auth.validation";
import { sendPasswordResetEmail, type ResetPasswordResponse } from "../service/forgot.password.service";

type ForgotFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotEmail() {
  const navigate = useNavigate();

  const forgotPasswordMutation = useMutation<
    ResetPasswordResponse,
    Error,
    ForgotFormValues
  >({
    mutationFn: sendPasswordResetEmail,
    onSuccess: (_data, variables) => {
      // toast.success(data.message || "Token berhasil dikirim ke email Anda.");
      toast.success("Token berhasil dikirim ke email Anda.");
      localStorage.setItem("forgotPasswordEmail", variables.email);
      navigate("/verify-token");
    },
    onError: (_error) => {
      // toast.error(error.message || "Gagal mengirim token. Silakan coba lagi.");
      toast.error("Gagal mengirim token. Silakan coba lagi.");
    },
  });

  const forgotForm = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onForgotSubmit = (values: ForgotFormValues) => {
    forgotPasswordMutation.mutate(values);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md mx-2 md:mx-0">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-violet-600">
            Lupa Kata Sandi
          </CardTitle>
          <CardDescription>
            Masukkan email Anda untuk menerima token reset kata sandi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...forgotForm}>
            <form onSubmit={forgotForm.handleSubmit(onForgotSubmit)} className="space-y-4">
              <FormField
                control={forgotForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@example.com" {...field} autoComplete="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-violet-600 hover:bg-violet-700 text-white"
                disabled={forgotPasswordMutation.isPending}
              >
                {forgotPasswordMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "Kirim Token"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
