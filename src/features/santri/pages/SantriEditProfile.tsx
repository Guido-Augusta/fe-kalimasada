import { ArrowLeft, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import SantriLayout from '../components/SantriLayout';
import { santriEditProfileSchema } from '../validation/santriEditValidation';
import useUser from '@/store/useUser';
import { useSantriDetail } from '@/features/admin/hooks/useSantriData';
import { useUpdateProfileSantriMutation } from '../hooks/useEditProfileSantri';

type FormData = z.infer<typeof santriEditProfileSchema>;

export default function SantriEditProfile() {
  const { user } = useUser();
  const navigate = useNavigate();

  const {
    data,
    isLoading: isFetchingData,
    isError,
    error: _error,
  } = useSantriDetail(user?.roleId as string);
  const updateMutation = useUpdateProfileSantriMutation();

  const form = useForm<FormData>({
    resolver: zodResolver(santriEditProfileSchema),
    values: data
      ? {
          nama: data.nama,
        }
      : undefined,
  });

  const onSubmit = (formData: FormData) => {
    if (user?.roleId) {
      const putFormData = new FormData();
      putFormData.append('nama', formData.nama);
      updateMutation.mutate({ id: user?.roleId, formData: putFormData });
    }
  };

  return (
    <SantriLayout>
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            // onClick={() => navigate("/santri/profile")}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-yellow-500 text-white hover:bg-yellow-600 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Kembali</span>
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Edit Profil
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
          <div className="flex justify-center items-center text-red-500">
            <p>Data santri tidak ditemukan</p>
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Informasi Personal
                    </CardTitle>
                  </CardHeader>
                  {/* <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="nama">
                        Nama Lengkap (digunakan untuk login)
                      </Label>
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
                  </CardContent> */}
                </Card>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button
                type="submit"
                disabled={updateMutation.isPending || isFetchingData}
                className="flex-1 sm:flex-none bg-blue-500 hover:bg-blue-600 hover:text-white text-white"
              >
                {(updateMutation.isPending || isFetchingData) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {updateMutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </SantriLayout>
  );
}
