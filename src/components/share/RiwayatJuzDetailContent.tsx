import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRiwayatJuzDetail } from '@/features/ustadz/hooks/useHafalanData';
import { toArabicNumber } from '@/utils/formatArabNumber';
import { formatTanggalIndo } from '@/utils/formatDate';
import { HafalanLabels, StatusBadge } from '@/components/share/HafalanLabels';

interface RiwayatJuzDetailContentProps {
  santriId: string;
  juzId: string;
  tanggal: string;
  status: string;
  backLink?: string;
}


export default function RiwayatJuzDetailContent({
  santriId,
  juzId,
  tanggal,
  status,
}: RiwayatJuzDetailContentProps) {
  const { data, isLoading, isError } = useRiwayatJuzDetail(
    santriId,
    juzId,
    tanggal,
    status
  );
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
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
            Detail Hafalan
          </h1>
        </div>
        <div className="flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="ml-2">Memuat detail hafalan...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
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
            Detail Hafalan
          </h1>
        </div>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
            <CardDescription>Gagal memuat data detail hafalan.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const riwayatJuzDetail = data?.data;

  if (!riwayatJuzDetail) {
    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
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
            Detail Hafalan
          </h1>
        </div>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Data Tidak Ditemukan</CardTitle>
            <CardDescription>
              Detail riwayat hafalan juz tidak tersedia.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-2 md:p-6 lg:p-8">
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
          Detail Hafalan
        </h1>
      </div>

      <Card className="bg-violet-600 text-white py-2">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            <p>Juz {riwayatJuzDetail.juz}</p>
            <div className="flex md:flex-row flex-col items-center gap-2 md:justify-center justify-between mt-2">
              <p className="text-base text-white order-2 md:order-1">
                {formatTanggalIndo(riwayatJuzDetail.tanggal)}
              </p>
              <StatusBadge
                status={riwayatJuzDetail.status}
                className="order-1 md:order-2"
              />
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-3 gap-2 md:gap-4 text-center sm:grid-cols-3 my-3">
        <div className="border bg-amber-100 border-violet-600/90 py-2 px-2 rounded-xl">
          <p className="font-semibold text-sm">Ustadz</p>
          <p className="text-wrap">{riwayatJuzDetail.ustadz.nama}</p>
        </div>
        <div className="border bg-amber-100 border-violet-600/90 py-2 px-2 rounded-xl">
          <p className="font-semibold text-sm">Halaman</p>
          <p className="text-wrap">
            {riwayatJuzDetail.rangeHalaman.awal} -{' '}
            {riwayatJuzDetail.rangeHalaman.akhir}
          </p>
        </div>
        <div className="border bg-amber-100 border-violet-600/90 py-2 px-2 rounded-xl">
          <p className="font-semibold text-sm">Total Poin</p>
          <p className="text-wrap ">{riwayatJuzDetail.totalPoin}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-center my-3">
        <div className="border bg-amber-100 border-violet-600/90 py-2 px-2 rounded-xl">
          <p className="font-semibold text-sm">Surah</p>
          <p className="text-wrap">
            {riwayatJuzDetail.surah.map((s) => s.namaLatin).join(', ')}
          </p>
        </div>
        <div className="border bg-amber-100 border-violet-600/90 py-2 px-2 rounded-xl">
          <p className="font-semibold text-sm">Catatan</p>
          <p className="text-wrap">{riwayatJuzDetail.catatan || '-'}</p>
        </div>
      </div>

      <div className="space-y-2">
        {riwayatJuzDetail.daftarAyat.map((ayat) => (
          <Card key={ayat.id} className="p-4 border border-violet-600/90">
            <div className="flex flex-col md:flex-row md:justify-between items-start">
              <span className="text-sm font-semibold text-violet-600 mb-2">
                {ayat.surah.namaLatin} Ayat {ayat.nomorAyat}
              </span>
              {ayat.keterangan && (
                <HafalanLabels
                  kualitas={ayat.kualitas}
                  keterangan={ayat.keterangan}
                  showKualitas={riwayatJuzDetail.status === 'TambahHafalan'}
                  showHafalLabel={riwayatJuzDetail.status === 'TambahHafalan'}
                />
              )}
            </div>

            <p
              className="text-right md:text-3xl text-2xl leading-14 md:leading-20 font-arabic"
              dir="rtl"
            >
              {ayat.arab}
              <span className="mr-2 text-md font-arabic">
                ۝{toArabicNumber(ayat.nomorAyat)}
              </span>
            </p>

            <p className="text-left text-base text-green-600 italic">
              {ayat.latin}
            </p>

            <p className="text-left text-base text-gray-800">{ayat.terjemah}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
