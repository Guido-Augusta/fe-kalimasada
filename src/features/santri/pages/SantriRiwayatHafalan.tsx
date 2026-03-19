import SantriLayout from '../components/SantriLayout';
import { Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import type {
  RiwayatHafalanResponse,
  HafalanStatus,
} from '@/features/ustadz/types/hafalan.type';
import RiwayatTable from '@/components/share/RiwayatTable';
import useUser from '@/store/useUser';
import { fetchRiwayatHafalan } from '@/features/ustadz/service/hafalan.service';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSantriRiwayatStore } from '@/store/useSantriRiwayatStore';

export default function SantriRiwayatHafalan() {
  const { user } = useUser();
  const navigate = useNavigate();
  const {
    statusFilter,
    setStatusFilter,
    modeFilter,
    setModeFilter,
    currentPage,
    setCurrentPage,
  } = useSantriRiwayatStore();

  const mySantriId = user?.roleId;

  const {
    data,
    isLoading,
    isError,
    error: _error,
    isFetching,
  } = useQuery<RiwayatHafalanResponse>({
    queryKey: [
      'riwayatHafalan',
      mySantriId,
      currentPage,
      statusFilter,
      modeFilter,
    ],
    queryFn: () =>
      fetchRiwayatHafalan(
        mySantriId as string,
        currentPage,
        statusFilter,
        modeFilter
      ),
    enabled: !!mySantriId,
  });

  const riwayatList = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;

  return (
    <SantriLayout>
      <div className="container mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white hover:text-white"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Kembali</span>
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Riwayat Hafalan : {user?.details?.nama}
          </h1>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <div className="flex md:justify-between justify-start flex-col md:flex-row md:items-center gap-2">
              <div className="mb-2 md:mb-0">
                <CardTitle>Riwayat Hafalan</CardTitle>
                <CardDescription>
                  Daftar catatan hafalan, murajaah, dan tahsin santri.
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Select
                  onValueChange={(value: 'ayat' | 'halaman') => {
                    setModeFilter(value);
                    setCurrentPage(1);
                  }}
                  value={modeFilter}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Pilih Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ayat">Ayat</SelectItem>
                    <SelectItem value="halaman">Halaman</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  onValueChange={(value: string) => {
                    setStatusFilter(value as HafalanStatus);
                    setCurrentPage(1);
                  }}
                  value={statusFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Pilih Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TambahHafalan">
                      Tambah Hafalan
                    </SelectItem>
                    <SelectItem value="Murajaah">Murajaah</SelectItem>
                    <SelectItem value="Tahsin">Tahsin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center items-center">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="ml-2">Memuat data riwayat hafalan...</p>
              </div>
            ) : isError ? (
              <div className="flex justify-center items-center text-red-500">
                {/* <p>Error: {(error as Error)?.message}</p> */}
                <p>Gagal memuat data riwayat hafalan.</p>
              </div>
            ) : (
              <RiwayatTable
                riwayatList={riwayatList}
                totalPages={totalPages}
                currentPage={currentPage}
                isFetching={isFetching}
                onPageChange={setCurrentPage}
                idSantri={mySantriId as string}
                showDeleteButton={false}
                role="santri"
                statusFilter={statusFilter}
                modeFilter={modeFilter}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </SantriLayout>
  );
}
