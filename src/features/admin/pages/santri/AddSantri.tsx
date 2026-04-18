import { useCallback, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Select from "react-select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { UserPlus, ArrowLeft, Eye, EyeOff } from "lucide-react";
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
  const [selectedOrtu, setSelectedOrtu] = useState<{ ayah?: number; ibu?: number; wali?: number }>({});
  const [showPassword, setShowPassword] = useState(false);


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
      password: "",
      nama: "",
      tahapHafalan: "Level1",
      ortuId: [],
    },
  });



  const onSubmit = (data: FormData) => {
    const formData = new FormData();
    formData.append("password", data.password);
    formData.append("nama", data.nama);
    formData.append("tahapHafalan", data.tahapHafalan);

    const allOrtuIds = Object.values(selectedOrtu).filter(Boolean);
    formData.append("ortuId", JSON.stringify(allOrtuIds));

    addMutation.mutate(formData, {
      onSuccess: () => {
        form.reset();
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
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <div className="flex items-center gap-2">
                            <FormControl>
                              <div className="relative flex-1">
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Masukkan password"
                                  {...field}
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
                            </FormControl>
                            <Button type="button" onClick={handleGeneratePassword} className="shrink-0">
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

                    </div>

                    <div className="md:w-1/2 space-y-6 mt-6 md:mt-0">


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

                    </div>
                  </div>

                  <div className="flex gap-4 pt-8">
                    <Button type="submit" className="flex-1" disabled={addMutation.isPending}>
                      {addMutation.isPending ? "Mendaftarkan..." : "Daftar Santri"}
                    </Button>
                    <Button type="button" variant="destructive"
                      onClick={() => {
                        form.reset();
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