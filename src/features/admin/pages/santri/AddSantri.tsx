import { useCallback, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Select from 'react-select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { UserPlus, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { santriRegisterSchema } from '../../validation/santri.validation';
import { useAddSantriMutation } from '../../hooks/useSantriData';
import {
  Select as ShadSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useOrangTuaList } from '../../hooks/useOrtuData';
import { useNavigate } from 'react-router-dom';
import { generateRandomPassword } from '@/utils/randomPassword';

type FormData = z.infer<typeof santriRegisterSchema>;
type Option = { label: string; value: string };

const AddSantri = () => {
  const navigate = useNavigate();
  const [searchOrtu, setSearchOrtu] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const addMutation = useAddSantriMutation();

  const { data: orangTuaOptions, isLoading: isLoadingOrtu } = useOrangTuaList(
    searchOrtu,
    ''
  );

  const form = useForm<FormData>({
    resolver: zodResolver(santriRegisterSchema),
    defaultValues: {
      password: '',
      nama: '',
      tahapHafalan: 'Level1',
      ortuId: [],
    },
  });

  const onSubmit = (data: FormData) => {
    const formData = new FormData();
    formData.append('password', data.password);
    formData.append('nama', data.nama);
    formData.append('tahapHafalan', data.tahapHafalan);
    formData.append('ortuId', JSON.stringify(data.ortuId));

    addMutation.mutate(formData, {
      onSuccess: () => {
        form.reset();
      },
    });
  };

  const formattedOrangTuaOptions =
    orangTuaOptions?.map(
      (ortu: { id: number; nama: string; tipe: string }) => ({
        value: ortu.id.toString(),
        label: `${ortu.nama} (${ortu.tipe})`,
      })
    ) || [];

  const handleInputChangeOrtu = useCallback((value: string) => {
    setSearchOrtu(value);
  }, []);

  const handleGeneratePassword = () => {
    const newPassword = generateRandomPassword(8);
    form.setValue('password', newPassword);
  };

  return (
    <AdminLayout>
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              size="sm"
              className="text-white flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 hover:text-white"
              onClick={() => navigate(-1)}
            >
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
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <div className="flex items-center gap-2">
                              <FormControl>
                                <div className="relative flex-1">
                                  <Input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Masukkan password"
                                    {...field}
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() =>
                                      setShowPassword(!showPassword)
                                    }
                                  >
                                    {showPassword ? (
                                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                      <Eye className="h-4 w-4 text-muted-foreground" />
                                    )}
                                  </Button>
                                </div>
                              </FormControl>
                              <Button
                                type="button"
                                onClick={handleGeneratePassword}
                                className="shrink-0"
                              >
                                Generate
                              </Button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="md:w-1/2 space-y-6 mt-6 md:mt-0">
                      {/* Select for Orang Tua */}
                      <FormItem>
                        <FormLabel>Orang Tua / Wali</FormLabel>
                        <Controller
                          name="ortuId"
                          control={form.control}
                          render={({ field }) => (
                            <Select
                              isMulti
                              options={formattedOrangTuaOptions}
                              onChange={(options) => {
                                field.onChange(
                                  options.map((opt) => Number(opt.value))
                                );
                              }}
                              onInputChange={handleInputChangeOrtu}
                              isClearable
                              isLoading={isLoadingOrtu}
                              placeholder="Pilih Orang Tua..."
                              value={formattedOrangTuaOptions.filter(
                                (opt: Option) =>
                                  field.value?.includes(Number(opt.value))
                              )}
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
                                  <SelectItem value="Level1">
                                    Level 1 - Juz 30
                                  </SelectItem>
                                  <SelectItem value="Level2">
                                    Level 2 - Surat Wajib
                                  </SelectItem>
                                  <SelectItem value="Level3">
                                    Level 3 - Juz 1-29
                                  </SelectItem>
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
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={addMutation.isPending}
                    >
                      {addMutation.isPending
                        ? 'Mendaftarkan...'
                        : 'Daftar Santri'}
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
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
