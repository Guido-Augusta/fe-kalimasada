import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useUpdateUstadzMutation } from "../hooks/useUstadzData";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { updateEmailPasswordSchema } from "../validation/ustad.validation";
import { useUpdateOrtuMutation } from "../hooks/useOrtuData";
import { useUpdateSantriMutation } from "../hooks/useSantriData";
import { generateRandomPassword } from "@/utils/randomPassword";

type FormData = z.infer<typeof updateEmailPasswordSchema>;

interface EditEmailPasswordDialogProps {
  id: string;
  initialEmail: string;
  role: string;
}

export function EditEmailPasswordDialog({ id, initialEmail, role }: EditEmailPasswordDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const ustadzMutation = useUpdateUstadzMutation();
  const ortuMutation = useUpdateOrtuMutation();
  const santriMutation = useUpdateSantriMutation();

  const updateMutation = role === "ortu" ? ortuMutation : role === "santri" ? santriMutation : ustadzMutation;

  const form = useForm<FormData>({
    resolver: zodResolver(updateEmailPasswordSchema),
  });

  useEffect(() => {
    if (isOpen && initialEmail) {
      form.reset({
        email: initialEmail,
        password: "",
      });
    } else {
        form.reset({
            email: "",
            password: "",
        });
    }
  }, [isOpen, initialEmail, form]);

  const onSubmit = (data: FormData) => {
    const putFormData = new FormData();
    if (data.email && role !== "santri") {
        putFormData.append("email", data.email);
    }
    if (data.password) {
        putFormData.append("password", data.password);
    }

    updateMutation.mutate({ id, formData: putFormData }, {
        onSuccess: () => {
            setIsOpen(false);
        }
    });
  };

  const handleGeneratePassword = () => {
    const newPassword = generateRandomPassword(8);
    form.setValue("password", newPassword);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="mt-3">
          {role === "santri" ? "Edit Password" : "Edit Email / Password"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit {role === "santri" ? "Password" : "Email & Password"}</DialogTitle>
          <DialogDescription>
            Anda bisa mengubah {role === "santri" ? "password" : "email atau password"} {role}.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4 py-4">
          {role !== "santri" && (
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Masukkan email baru"
                {...form.register("email")}
              />
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.email?.message}
              </p>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password baru"
                  {...form.register("password")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              <Button type="button" onClick={handleGeneratePassword} className="shrink-0" size="sm">
                Generate
              </Button>
            </div>
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.password?.message}
            </p>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={updateMutation.isPending}
            >
              Batal
            </Button>
            <Button 
                type="button" 
                onClick={form.handleSubmit(onSubmit)}
                disabled={updateMutation.isPending}
            >
              {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}