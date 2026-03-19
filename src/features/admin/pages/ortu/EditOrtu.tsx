import { useState, useEffect } from "react";
import { ArrowLeft, Upload, User, Phone, MapPin, Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import { useOrtuDetail, useUpdateOrtuMutation } from "../../hooks/useOrtuData";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ortuUpdateSchemaAdmin } from "../../validation/ortu.validation";
import { z } from "zod";
import Select from "react-select";
import { EditEmailPasswordDialog } from "../../components/EditEmailPasswordDialog";

type FormData = z.infer<typeof ortuUpdateSchemaAdmin>;

export default function EditOrtu() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const { data, isLoading: isFetchingData, isError } = useOrtuDetail(id as string);
  const updateMutation = useUpdateOrtuMutation();

  const form = useForm<FormData>({
    resolver: zodResolver(ortuUpdateSchemaAdmin),
    values: data ? {
        nama: data.nama,
        nomorTelepon: data.nomorHp,
        alamat: data.alamat,
        jenisKelamin: data.jenisKelamin,
        tipe: data.tipe,
        foto: undefined,
    } : undefined,
  });

  useEffect(() => {
    if (data) {
      setPreviewImage(data.fotoProfil);
    }
  }, [data]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("foto", file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const onSubmit = (formData: FormData) => {
    if (id) {
      const putFormData = new FormData();
      putFormData.append("nama", formData.nama);
      putFormData.append("nomorHp", formData.nomorTelepon);
      putFormData.append("alamat", formData.alamat);
      putFormData.append("jenisKelamin", formData.jenisKelamin);
      putFormData.append("tipe", formData.tipe);
      if (formData.foto) {
        putFormData.append("fotoProfil", formData.foto);
      }
      updateMutation.mutate({ id, formData: putFormData });
    }
  };

  const jenisKelaminOptions = [
    { value: "L", label: "Laki-laki" },
    { value: "P", label: "Perempuan" },
  ];

  const tipeOrangTuaOptions = [
    { value: "Ayah", label: "Ayah" },
    { value: "Ibu", label: "Ibu" },
    { value: "Wali", label: "Wali" }
  ]

  return (
    <AdminLayout>
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 hover:text-white text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Kembali</span>
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Edit Orang Tua</h1>
        </div>

        { isFetchingData ? (
          <div className="flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="ml-2">Memuat...</p>
          </div>
        ) : isError ? (
          <div className="flex justify-center items-center text-red-500">
            {/* <p>Error: {error?.message}</p> */}
            <p>Gagal memuat data orang tua. Coba lagi.</p>
          </div>
        ) :  (
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Foto Profil
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-32 w-32">
                      <AvatarImage 
                        src={previewImage || data?.fotoProfil}
                        alt="Preview"
                        className="object-cover"
                      />
                      <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                        {data?.nama.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="w-full">
                      <Label htmlFor="foto-upload" className="cursor-pointer">
                        <div className="flex items-center justify-center gap-2 h-10 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md transition-colors">
                          <Upload className="h-4 w-4" />
                          Upload Foto
                        </div>
                      </Label>
                      <Input
                        id="foto-upload"
                        type="file"
                        accept="image/jpeg, image/jpg, image/png"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <p className="text-xs text-muted-foreground mt-2 text-center">
                        Format: JPG, PNG. Max: 1MB
                      </p>
                      <p className="text-sm font-medium text-red-500 text-center mt-1">
                        {form.formState.errors.foto?.message}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <EditEmailPasswordDialog id={id as string} initialEmail={data?.user.email as string} role="ortu" />
            </div>

            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informasi Personal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="nama">Nama Lengkap</Label>
                    <Input
                      id="nama"
                      type="text"
                      placeholder="Masukkan nama lengkap"
                      {...form.register("nama")}
                    />
                    <p className="text-sm font-medium text-destructive">
                      {form.formState.errors.nama?.message}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nomorTelepon" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Nomor Telepon
                    </Label>
                    <Input
                      id="nomorTelepon"
                      type="tel"
                      placeholder="Contoh: 08123456789"
                      {...form.register("nomorTelepon")}
                    />
                    <p className="text-sm font-medium text-destructive">
                      {form.formState.errors.nomorTelepon?.message}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="alamat" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Alamat
                    </Label>
                    <Textarea
                      id="alamat"
                      placeholder="Masukkan alamat lengkap"
                      className="min-h-[80px]"
                      {...form.register("alamat")}
                    />
                    <p className="text-sm font-medium text-destructive">
                      {form.formState.errors.alamat?.message}
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="jenisKelamin">Jenis Kelamin</Label>
                      <Controller
                        control={form.control}
                        name="jenisKelamin"
                        render={({ field }) => (
                          <Select
                            value={jenisKelaminOptions.find(option => option.value === field.value) || null}
                            onChange={(option) => field.onChange(option?.value)}
                            options={jenisKelaminOptions}
                            placeholder="Pilih jenis kelamin"
                          />
                        )}
                      />
                      <p className="text-sm font-medium text-destructive">
                        {form.formState.errors.jenisKelamin?.message}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tipe">Tipe Orang Tua</Label>
                      <Controller
                        control={form.control}
                        name="tipe"
                        render={({ field }) => (
                          <Select
                            value={tipeOrangTuaOptions.find(option => option.value === field.value) || null}
                            onChange={(option) => field.onChange(option?.value)}
                            options={tipeOrangTuaOptions}
                            placeholder="Pilih tipe Orang tua"
                          />
                        )}
                      />
                      <p className="text-sm font-medium text-destructive">
                        {form.formState.errors.tipe?.message}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button 
              type="submit" 
              disabled={updateMutation.isPending || isFetchingData}
              className="flex-1 sm:flex-none bg-blue-500 hover:bg-blue-600 hover:text-white text-white"
            >
              {(updateMutation.isPending || isFetchingData) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {updateMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={() => navigate("/admin/orangtua")}
              className="flex-1 sm:flex-none"
              disabled={updateMutation.isPending}
            >
              Batal
            </Button>
          </div>
        </form>
        )}
      </div>
    </AdminLayout>
  );
}