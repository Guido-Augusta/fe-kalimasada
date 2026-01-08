import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Upload, UserPlus, Trash2, ArrowLeft } from "lucide-react";
import AdminLayout from "../../components/AdminLayout";
import { ortuRegisterSchema } from "../../validation/ortu.validation";
import { useAddOrtuMutation } from "../../hooks/useOrtuData";
import { useNavigate } from "react-router-dom";
import { generateRandomPassword } from "@/utils/randomPassword";

type FormData = z.infer<typeof ortuRegisterSchema>;

const AddOrtu = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  const addMutation = useAddOrtuMutation();
  const navigate = useNavigate();

  const form = useForm<FormData>({
    resolver: zodResolver(ortuRegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      nama: "",
      nomorTelepon: "",
      alamat: "",
      jenisKelamin: "L",
      tipe: "Ayah",
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("foto", file);
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const handleRemoveImage = () => {
    form.setValue("foto", undefined);
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = (data: FormData) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("nama", data.nama);
    formData.append("nomorHp", data.nomorTelepon);
    formData.append("alamat", data.alamat);
    formData.append("jenisKelamin", data.jenisKelamin);
    formData.append("tipe", data.tipe);
    if (data.foto) {
      formData.append("fotoProfil", data.foto);
    }
    // console.log(formData);
    addMutation.mutate(formData, {
      onSuccess: () => {
        form.reset();
        setSelectedImage(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      },
    });
  };

  const handleGeneratePassword = () => {
    const newPassword = generateRandomPassword(8);
    form.setValue("password", newPassword);
  };

  return (
    <AdminLayout>
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="sm" className="text-white flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 hover:text-white" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sm:inline">Kembali</span>
            </Button>
          </div>

          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                <UserPlus className="h-6 w-6" />
                Daftar Orang Tua Baru
              </CardTitle>
              <CardDescription>
                Lengkapi form berikut untuk mendaftarkan orang tua baru
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="flex flex-col md:flex-row md:space-x-8">
                    <div className="md:w-1/2 md:space-y-6 space-y-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="contoh@email.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <div className="flex items-center gap-2">
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="Generate password"
                                  readOnly
                                  {...field}
                                />
                              </FormControl>
                              <Button type="button" onClick={handleGeneratePassword} className="ml-2">Generate</Button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="nama"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nama Lengkap</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Masukkan nama lengkap"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="nomorTelepon"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nomor Telepon</FormLabel>
                            <FormControl>
                              <Input
                                type="tel"
                                placeholder="08xxxxxxxxxx"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="md:w-1/2 md:space-y-6 mt-6 md:mt-0 space-y-4">
                      <FormField
                        control={form.control}
                        name="alamat"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Alamat</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Masukkan alamat lengkap"
                                className="min-h-[80px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="jenisKelamin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Jenis Kelamin</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value}
                                className="flex gap-6"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="L" id="laki-laki" />
                                  <Label htmlFor="laki-laki">Laki-laki</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="P" id="perempuan" />
                                  <Label htmlFor="perempuan">Perempuan</Label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="tipe"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipe Orang Tua</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value}
                                className="flex gap-6"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="Ayah" id="ayah" />
                                  <Label htmlFor="ayah">Ayah</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="Ibu" id="ibu" />
                                  <Label htmlFor="ibu">Ibu</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="Wali" id="wali" />
                                  <Label htmlFor="wali">Wali</Label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="foto"
                        render={({ field: { onChange, value, ...field } }) => (
                          <FormItem>
                            <FormLabel>Foto (Opsional) - Format: .jpg, .jpeg, .png | Max: 1MB</FormLabel>
                            <FormControl>
                              <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                  <Input
                                    type="file"
                                    accept="image/*"
                                    {...field}
                                    ref={(el) => {
                                      fileInputRef.current = el;
                                      field.ref(el);
                                    }}
                                    onChange={handleImageChange}
                                    value={undefined}
                                    className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                                  />
                                  <Upload className="h-4 w-4 text-muted-foreground" />
                                </div>
                                {selectedImage && (
                                  <div className="flex flex-col items-start space-y-2">
                                    <div className="w-32 h-32 rounded-lg overflow-hidden border">
                                      <img
                                        src={selectedImage}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      onClick={handleRemoveImage}
                                      className="text-sm text-destructive hover:bg-destructive/10"
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Hapus Foto
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-8">
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={addMutation.isPending}
                    >
                      {addMutation.isPending
                        ? "Mendaftarkan..."
                        : "Daftar Orang Tua"}
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => {
                        form.reset();
                        setSelectedImage(null);
                      }}
                      className="flex-1"
                      disabled={addMutation.isPending}
                    >
                      Reset Form
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddOrtu;