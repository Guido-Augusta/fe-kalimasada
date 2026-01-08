import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useChangePasswordWizard } from "../hooks/useChangePasswordWizard";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

export default function ChangePasswordWizard() {
  const navigate = useNavigate();
  const {
    step,
    verifyForm,
    changeForm,
    handleVerify,
    handleChangePassword,
    cancelChangePassword,
    showSuccessModal,
    handleLoginAfterSuccess,
  } = useChangePasswordWizard();

  const [showNewPassword, setShowNewPassword] = useState(false);

  return (
    <div className="flex flex-col justify-center items-center md:min-h-screen">
      <div className="w-full max-w-md">
        <Button variant="outline" size="sm" className="flex items-center gap-2 bg-yellow-500 text-white hover:bg-yellow-600 hover:text-white" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali</span>
        </Button>
        <h1 className="text-2xl font-bold my-2">Ubah Kata Sandi</h1>
      </div>
      <Card className="w-full max-w-md p-4">
        <CardHeader>
          <CardTitle>
            <div className="flex justify-between items-center">
              {step === 1 ? "Verifikasi Kata Sandi Lama" : "Masukan Kata Sandi Baru"}
              {step !== 1 && (
                <Button onClick={cancelChangePassword} className="ml-2">
                  Batal
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <Form {...verifyForm}>
              <form onSubmit={verifyForm.handleSubmit(handleVerify)} className="space-y-4">
                <FormField
                  control={verifyForm.control}
                  name="oldPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Masukan Kata Sandi Lama</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Masukkan password lama" {...field} autoComplete="current-password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">Verifikasi</Button>
              </form>
            </Form>
          )}

          {step === 2 && (
            <Form {...changeForm}>
              <form onSubmit={changeForm.handleSubmit(handleChangePassword)} className="space-y-4">
                <FormField
                  control={changeForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Masukan Kata Sandi Baru</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Masukkan password baru"
                            {...field}
                            autoComplete="new-password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                          >
                            {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">Ubah Kata Sandi</Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>

      <Dialog open={showSuccessModal} onOpenChange={() => {}}>
        <DialogContent
          className="sm:max-w-[425px]"
          onEscapeKeyDown={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Berhasil Mengubah Kata Sandi 🎉</DialogTitle>
            <DialogDescription>
              Kata Sandi Anda telah berhasil diubah. Silakan login kembali dengan Kata Sandi baru Anda.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleLoginAfterSuccess}>
              Login Ulang
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}