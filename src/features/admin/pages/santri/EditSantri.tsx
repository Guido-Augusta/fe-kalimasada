import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Upload, User, Phone, MapPin, Camera, Loader2, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import { useSantriDetail, useUpdateSantriMutation } from "../../hooks/useSantriData";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { santriUpdateSchemaAdmin } from "../../validation/santri.validation";
import { z } from "zod";
import Select from "react-select";
import { useOrangTuaList } from "../../hooks/useOrtuData";
import { formatDate } from "@/utils/formatDate";
import { EditEmailPasswordDialog } from "../../components/EditEmailPasswordDialog";

type FormData = z.infer<typeof santriUpdateSchemaAdmin>;
type Option = { label: string; value: string };
type OptionFormated = { id: string; nama: string };

export default function EditSantri() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data, isLoading: isFetchingData, isError, error: _error } = useSantriDetail(id as string);
  const [selectedOrtu, setSelectedOrtu] = useState<{ ayah?: number; ibu?: number; wali?: number }>({});
  
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [searchAyah, setSearchAyah] = useState("");
  const [searchIbu, setSearchIbu] = useState("");
  const [searchWali, setSearchWali] = useState("");
  const updateMutation = useUpdateSantriMutation();

  const { data: orangTuaAyahOptions, isLoading: isLoadingOrtuAyah } = useOrangTuaList(searchAyah, "Ayah");
  const { data: orangTuaIbuOptions, isLoading: isLoadingOrtuIbu } = useOrangTuaList(searchIbu, "Ibu");
  const { data: orangTuaWaliOptions, isLoading: isLoadingOrtuWali } = useOrangTuaList(searchWali, "Wali");

  const form = useForm<FormData>({
    resolver: zodResolver(santriUpdateSchemaAdmin),
    values: data ? {
        ortuId: data.orangTua ? data.orangTua.map(parent => parent.id) : [],
        nama: data.nama,
        noInduk: data.noInduk || "",
        nomorTelepon: data.nomorHp || "",
        alamat: data.alamat,
        jenisKelamin: data.jenisKelamin,
        tanggalLahir: formatDate(data.tanggalLahir),
        tahapHafalan: data.tahapHafalan,
        foto: undefined,
    } : undefined,
  });

  useEffect(() => {
    if (data) {
      setPreviewImage(data.fotoProfil);
      const initialOrtu = data.orangTua.reduce((acc, ortu) => {
        if (ortu.tipe === "Ayah") acc.ayah = ortu.id;
        if (ortu.tipe === "Ibu") acc.ibu = ortu.id;
        if (ortu.tipe === "Wali") acc.wali = ortu.id;
        return acc;
      }, {} as { ayah?: number; ibu?: number; wali?: number });
      setSelectedOrtu(initialOrtu);
    }
  }, [data]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("foto", file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSelectChange = (type: 'ayah' | 'ibu' | 'wali', option: { value: string, label: string } | null) => {
    setSelectedOrtu(prev => {
      const newState = { ...prev };
      if (option) {
        newState[type] = Number(option.value);
      } else {
        delete newState[type];
      }
  
      const allOrtuIds = Object.values(newState).filter(Boolean).map(id => Number(id));
      form.setValue('ortuId', allOrtuIds, { shouldValidate: true });
  
      return newState;
    });
  };

  const onSubmit = (formData: FormData) => {
    if (id) {
      const putFormData = new FormData();
      putFormData.append("nama", formData.nama);
      putFormData.append("noInduk", formData.noInduk);
      putFormData.append("nomorHp", formData.nomorTelepon || "");
      putFormData.append("alamat", formData.alamat);
      putFormData.append("jenisKelamin", formData.jenisKelamin);
      putFormData.append("tanggalLahir", formData.tanggalLahir);
      putFormData.append("tahapHafalan", formData.tahapHafalan);

      if (formData.ortuId && formData.ortuId.length > 0) {
        putFormData.append("ortuId", JSON.stringify(formData.ortuId));
      }

      if (formData.foto) {
        putFormData.append("fotoProfil", formData.foto);
      }
      updateMutation.mutate({ id, formData: putFormData });
    }
  };  

  const tahapHafalanOptions = [
    { value: "Level1", label: "Level 1 - Juz 30" },
    { value: "Level2", label: "Level 2 - Surat Wajib" },
    { value: "Level3", label: "Level 3 - Juz 1-29" },
  ];

  const formattedOrangTuaAyahOptions = orangTuaAyahOptions?.map((ortu: OptionFormated) => ({ value: ortu.id.toString(), label: ortu.nama })) || [];
  const formattedOrangTuaIbuOptions = orangTuaIbuOptions?.map((ortu: OptionFormated) => ({ value: ortu.id.toString(), label: ortu.nama })) || [];
  const formattedOrangTuaWaliOptions = orangTuaWaliOptions?.map((ortu: OptionFormated) => ({ value: ortu.id.toString(), label: ortu.nama })) || [];

  const handleInputChangeAyah = useCallback((value: string) => {
    setSearchAyah(value);
  }, []);  
  
  const handleInputChangeIbu = useCallback((value: string) => {
    setSearchIbu(value);
  }, []);  
  
  const handleInputChangeWali = useCallback((value: string) => {
    setSearchWali(value);
  }, []);  

  return (
    <AdminLayout>
      <div className="container mx-auto p-4 max-w-4xl">
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
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Edit Santri</h1>
        </div>

        { isFetchingData ? (
          <div className="flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="ml-2">Memuat...</p>
          </div>
        ) : isError ? (
          <div className="flex justify-center items-center text-red-500">
            {/* <p>Error: {error?.message}</p> */}
            <p>Gagal memuat data detail santri.</p>
          </div>
        ) : !data ? (
          <div className="flex justify-center items-center text-muted-foreground">
            <p>Data santri tidak ditemukan.</p>
          </div>
        ) : (
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
              <EditEmailPasswordDialog id={id as string} initialEmail={data?.user.email as string} role="santri" />            
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
                    <Label htmlFor="noInduk" className="flex items-center gap-2">
                      Nomor Induk
                    </Label>
                    <Input
                      id="noInduk"
                      type="text"
                      placeholder="Masukkan no induk"
                      {...form.register("noInduk")}
                    />
                    <p className="text-sm font-medium text-destructive">
                      {form.formState.errors.noInduk?.message}
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="tanggalLahir" className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      Tanggal Lahir
                    </Label>
                    <Input
                      id="tanggalLahir"
                      type="date"
                      {...form.register("tanggalLahir")}
                    />
                    <p className="text-sm font-medium text-destructive">
                      {form.formState.errors.tanggalLahir?.message}
                    </p>
                  </div>

                  {/* Select untuk Ayah */}
                  <div className="space-y-2">
                    <Label htmlFor="ayah">Ayah</Label>
                    <Controller
                      name="ortuId"
                      control={form.control}
                      render={() => (
                        <Select
                          options={formattedOrangTuaAyahOptions}
                          onChange={(option) => handleSelectChange('ayah', option)}
                          // onInputChange={(value) => setSearchAyah(value)}
                          onInputChange={handleInputChangeAyah}
                          isClearable
                          isLoading={isLoadingOrtuAyah}
                          placeholder="Pilih Ayah..."
                          value={formattedOrangTuaAyahOptions.find((opt: Option) => Number(opt.value) === selectedOrtu.ayah) || null}
                        />
                      )}
                    />
                  </div>

                  {/* Select untuk Ibu */}
                  <div className="space-y-2">
                    <Label htmlFor="ibu">Ibu</Label>
                    <Controller
                      name="ortuId"
                      control={form.control}
                      render={() => (
                        <Select
                          options={formattedOrangTuaIbuOptions}
                          onChange={(option) => handleSelectChange('ibu', option)}
                          onInputChange={handleInputChangeIbu}
                          isClearable
                          isLoading={isLoadingOrtuIbu}
                          placeholder="Pilih Ibu..."
                          value={formattedOrangTuaIbuOptions.find((opt: Option) => Number(opt.value) === selectedOrtu.ibu) || null}
                        />
                      )}
                    />
                  </div>

                  {/* Select untuk Wali */}
                  <div className="space-y-2">
                    <Label htmlFor="wali">Wali</Label>
                    <Controller
                      name="ortuId"
                      control={form.control}
                      render={() => (
                        <Select
                          options={formattedOrangTuaWaliOptions}
                          onChange={(option) => handleSelectChange('wali', option)}
                          onInputChange={handleInputChangeWali}
                          isClearable
                          isLoading={isLoadingOrtuWali}
                          placeholder="Pilih Wali..."
                          value={formattedOrangTuaWaliOptions.find((opt: Option) => Number(opt.value) === selectedOrtu.wali) || null}
                        />
                      )}
                    />
                  </div>
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.ortuId?.message}
                  </p>

                  <div className="space-y-2">
                    <Label htmlFor="jenisKelamin">Jenis Kelamin</Label>
                    <Controller
                      control={form.control}
                      name="jenisKelamin"
                      render={({ field }) => (
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
                      )}
                    />
                    <p className="text-sm font-medium text-destructive">
                      {form.formState.errors.jenisKelamin?.message}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tahapHafalan" className="flex items-center gap-2">
                      Tahap Hafalan
                    </Label>
                    <Controller
                      control={form.control}
                      name="tahapHafalan"
                      render={({ field }) => (
                        <Select
                          value={tahapHafalanOptions.find(option => option.value === field.value) || null}
                          onChange={(option) => field.onChange(option?.value)}
                          options={tahapHafalanOptions}
                          placeholder="Pilih tahap hafalan..."
                        />
                      )}
                    />
                    <p className="text-sm font-medium text-destructive">
                      {form.formState.errors.tahapHafalan?.message}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button 
              type="submit" 
              disabled={updateMutation.isPending || isFetchingData}
              className="flex-1 sm:flex-none"
            >
              {(updateMutation.isPending || isFetchingData) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {updateMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={() => navigate("/admin/santri")}
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