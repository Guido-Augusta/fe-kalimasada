import { useCallback, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Select from "react-select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { Upload, UserPlus, Trash2, ArrowLeft } from "lucide-react";
import AdminLayout from "../../components/AdminLayout";
import { santriRegisterSchema } from "../../validation/santri.validation";
import { useAddSantriMutation } from "../../hooks/useSantriData";
import { Select as ShadSelect, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { useOrangTuaList } from "../../hooks/useOrtuData";
import { useNavigate } from "react-router-dom";
import { generateRandomPassword } from "@/utils/randomPassword";

type FormData = z.infer<typeof santriRegisterSchema>;
type Option = { label: string; value: string };

const AddSantri = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedOrtu, setSelectedOrtu] = useState<{ ayah?: number; ibu?: number; wali?: number }>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [searchAyah, setSearchAyah] = useState("");
  const [searchIbu, setSearchIbu] = useState("");
  const [searchWali, setSearchWali] = useState("");
  const addMutation = useAddSantriMutation();

  const { data: orangTuaAyahOptions, isLoading: isLoadingOrtuAyah } = useOrangTuaList(searchAyah, "Ayah");
  const { data: orangTuaIbuOptions, isLoading: isLoadingOrtuIbu } = useOrangTuaList(searchIbu, "Ibu");
  const { data: orangTuaWaliOptions, isLoading: isLoadingOrtuWali } = useOrangTuaList(searchWali, "Wali");

  const form = useForm<FormData>({
    resolver: zodResolver(santriRegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      nama: "",
      noInduk: "",
      nomorTelepon: "",
      alamat: "",
      jenisKelamin: "L",
      tanggalLahir: "",
      tahapHafalan: "Level1",
      ortuId: [],
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
    formData.append("nomorHp", data.nomorTelepon || "");
    formData.append("noInduk", data.noInduk);
    formData.append("alamat", data.alamat);
    formData.append("jenisKelamin", data.jenisKelamin);
    formData.append("tanggalLahir", data.tanggalLahir);
    formData.append("tahapHafalan", data.tahapHafalan);

    const allOrtuIds = Object.values(selectedOrtu).filter(Boolean);
    formData.append("ortuId", JSON.stringify(allOrtuIds));

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

  const formattedOrangTuaAyahOptions = orangTuaAyahOptions?.map((ortu: {id: number, nama: string}) => ({
    value: ortu.id.toString(),
    label: ortu.nama,
  })) || [];

  const formattedOrangTuaIbuOptions = orangTuaIbuOptions?.map((ortu: {id: number, nama: string}) => ({
    value: ortu.id.toString(),
    label: ortu.nama,
  })) || [];

  const formattedOrangTuaWaliOptions = orangTuaWaliOptions?.map((ortu: {id: number, nama: string}) => ({
    value: ortu.id.toString(),
    label: ortu.nama,
  })) || [];

  const handleSelectChange = (type: 'ayah' | 'ibu' | 'wali', option: { value: string, label: string } | null) => {
    setSelectedOrtu(prev => {
      const newState = { ...prev };
      if (option) {
        newState[type] = Number(option.value);
      } else {
        delete newState[type];
      }
      const allOrtuIds = Object.values(newState).filter(Boolean).map(id => Number(id));
      form.setValue('ortuId', allOrtuIds);
      return newState;
    });
  };

  const handleInputChangeAyah = useCallback((value: string) => {
    setSearchAyah(value);
  }, []);  

  const handleInputChangeIbu = useCallback((value: string) => {
    setSearchIbu(value);
  }, []);  

  const handleInputChangeWali = useCallback((value: string) => {
    setSearchWali(value);
  }, []);  

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
                Daftar Santri Baru
              </CardTitle>
              <CardDescription>
                Lengkapi form berikut untuk mendaftarkan santri baru
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="flex flex-col md:flex-row md:space-x-8">
                    <div className="md:w-1/2 space-y-6">
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
                                // autoComplete="email-santri"
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
                            <Button type="button" onClick={handleGeneratePassword} className="ml-2">
                              Generate
                            </Button>
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
                        name="noInduk"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nomor Induk</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="Masukkan no induk"
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
                            <FormLabel>Nomor Telepon (Opsional)</FormLabel>
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
                      <FormField
                        control={form.control}
                        name="tanggalLahir"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tanggal Lahir</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
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
                    </div>

                    <div className="md:w-1/2 space-y-6 mt-6 md:mt-0">
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

                      {/* Select for Ayah */}
                      <FormItem>
                        <FormLabel>Ayah</FormLabel>
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
                        <FormMessage />
                      </FormItem>

                      {/* Select for Ibu */}
                      <FormItem>
                        <FormLabel>Ibu</FormLabel>
                        <Controller
                          name="ortuId"
                          control={form.control}
                          render={() => (
                            <Select
                              options={formattedOrangTuaIbuOptions}
                              onChange={(option) => handleSelectChange('ibu', option)}
                              // onInputChange={(value) => setSearchIbu(value)}
                              onInputChange={handleInputChangeIbu}
                              isClearable
                              isLoading={isLoadingOrtuIbu}
                              placeholder="Pilih Ibu..."
                              value={formattedOrangTuaIbuOptions.find((opt: Option) => Number(opt.value) === selectedOrtu.ibu) || null}
                            />
                          )}
                        />
                        <FormMessage />
                      </FormItem>

                      {/* Select for Wali */}
                      <FormItem>
                        <FormLabel>Wali</FormLabel>
                        <Controller
                          name="ortuId"
                          control={form.control}
                          render={() => (
                            <Select
                              options={formattedOrangTuaWaliOptions}
                              onChange={(option) => handleSelectChange('wali', option)}
                              // onInputChange={(value) => setSearchWali(value)}
                              onInputChange={handleInputChangeWali}
                              isClearable
                              isLoading={isLoadingOrtuWali}
                              placeholder="Pilih Wali..."
                              value={formattedOrangTuaWaliOptions.find((opt: Option) => Number(opt.value) === selectedOrtu.wali) || null}
                            />
                          )}
                        />
                        <FormMessage />
                      </FormItem>
                      <p className="text-sm font-medium text-red-500 text-center">
                        {form.formState.errors.ortuId?.message}
                      </p>

                      <FormField
                        control={form.control}
                        name="tahapHafalan"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tahap Hafalan</FormLabel>
                            <FormControl>
                              <ShadSelect
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih Tahap Hafalan" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Level1">Level 1 - Juz 30</SelectItem>
                                  <SelectItem value="Level2">Level 2 - Surat Wajib</SelectItem>
                                  <SelectItem value="Level3">Level 3 - Juz 1-29</SelectItem>
                                </SelectContent>
                              </ShadSelect>
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
                            <FormLabel>Foto (Opsional)</FormLabel>
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
                    <Button type="submit" className="flex-1" disabled={addMutation.isPending}>
                      {addMutation.isPending ? "Mendaftarkan..." : "Daftar Santri"}
                    </Button>
                    <Button type="button" variant="destructive"
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

export default AddSantri;