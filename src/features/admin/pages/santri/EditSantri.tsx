import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import {
  useSantriDetail,
  useUpdateSantriMutation,
} from '../../hooks/useSantriData';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { santriUpdateSchemaAdmin } from '../../validation/santri.validation';
import { z } from 'zod';
import Select from 'react-select';
import { useOrangTuaList } from '../../hooks/useOrtuData';
import { EditEmailPasswordDialog } from '../../components/EditEmailPasswordDialog';

type FormData = z.infer<typeof santriUpdateSchemaAdmin>;
type Option = { label: string; value: string };
type OptionFormated = { id: string; nama: string };

export default function EditSantri() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const {
    data,
    isLoading: isFetchingData,
    isError,
    error: _error,
  } = useSantriDetail(id as string);

  const [searchOrtu, setSearchOrtu] = useState('');
  const updateMutation = useUpdateSantriMutation();

  const { data: orangTuaOptions, isLoading: isLoadingOrtu } =
    useOrangTuaList(searchOrtu, '');

  const form = useForm<FormData>({
    resolver: zodResolver(santriUpdateSchemaAdmin),
    values: data
      ? {
          ortuId: data.orangTua ? data.orangTua.map((parent) => parent.id) : [],
          nama: data.nama,
          tahapHafalan: data.tahapHafalan,
        }
      : undefined,
  });

  // No useEffect needed for selectedOrtu anymore

  // handleSelectChange removed as it's handled by Controller directly

  const onSubmit = (formData: FormData) => {
    if (id) {
      const putFormData = new FormData();
      putFormData.append('nama', formData.nama);
      putFormData.append('tahapHafalan', formData.tahapHafalan);

      if (formData.ortuId && formData.ortuId.length > 0) {
        putFormData.append('ortuId', JSON.stringify(formData.ortuId));
      }

      updateMutation.mutate({ id, formData: putFormData });
    }
  };

  const tahapHafalanOptions = [
    { value: 'Level1', label: 'Level 1 - Juz 30' },
    { value: 'Level2', label: 'Level 2 - Surat Wajib' },
    { value: 'Level3', label: 'Level 3 - Juz 1-29' },
  ];

  const formattedOrangTuaOptions =
    orangTuaOptions?.map((ortu: {id: number, nama: string, tipe: string}) => ({
      value: ortu.id.toString(),
      label: `${ortu.nama} (${ortu.tipe})`,
    })) || [];

  const handleInputChangeOrtu = useCallback((value: string) => {
    setSearchOrtu(value);
  }, []);

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
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Edit Santri
          </h1>
        </div>

        {isFetchingData ? (
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
            <div className="grid gap-6 lg:grid-cols-1">
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
                        {...form.register('nama')}
                      />
                      <p className="text-sm font-medium text-destructive">
                        {form.formState.errors.nama?.message}
                      </p>
                    </div>

                    {/* Select untuk Orang Tua */}
                    <div className="space-y-2">
                      <Label htmlFor="ortuId">Orang Tua / Wali</Label>
                      <Controller
                        name="ortuId"
                        control={form.control}
                        render={({ field }) => (
                          <Select
                            isMulti
                            options={formattedOrangTuaOptions}
                            onChange={(options) => {
                              field.onChange(options.map(opt => Number(opt.value)));
                            }}
                            onInputChange={handleInputChangeOrtu}
                            isClearable
                            isLoading={isLoadingOrtu}
                            placeholder="Pilih Orang Tua..."
                            value={formattedOrangTuaOptions.filter((opt: Option) => field.value?.includes(Number(opt.value)))}
                          />
                        )}
                      />
                    </div>
                    <p className="text-sm font-medium text-destructive">
                      {form.formState.errors.ortuId?.message}
                    </p>

                    <div className="space-y-2">
                      <Label
                        htmlFor="tahapHafalan"
                        className="flex items-center gap-2"
                      >
                        Tahap Hafalan
                      </Label>
                      <Controller
                        control={form.control}
                        name="tahapHafalan"
                        render={({ field }) => (
                          <Select
                            value={
                              tahapHafalanOptions.find(
                                (option) => option.value === field.value
                              ) || null
                            }
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
                    <EditEmailPasswordDialog
                      id={id as string}
                      initialEmail={data?.user.email as string}
                      role="santri"
                    />
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
                {(updateMutation.isPending || isFetchingData) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {updateMutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => navigate('/admin/santri')}
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
