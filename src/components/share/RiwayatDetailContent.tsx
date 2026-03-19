import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRiwayatDetail } from '@/features/ustadz/hooks/useHafalanData';
import { toArabicNumber } from '@/utils/formatArabNumber';
import { formatTanggalIndo } from '@/utils/formatDate';
import { HafalanLabels, StatusBadge } from '@/components/share/HafalanLabels';

interface RiwayatDetailContentProps {
  santriId: string;
  surahId: string;
  tanggal: string;
  status: string;
  backLink?: string;
}

export default function RiwayatDetailContent({
  santriId,
  surahId,
  tanggal,
  status,
}: RiwayatDetailContentProps) {
  const {
    data,
    isLoading,
    isError,
    error: _error,
  } = useRiwayatDetail(santriId, surahId, tanggal, status);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="container mx-auto">
        <div className="flex items-center gap-4 mb-6">
          {/* <Link to={backLink}> */}
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white hover:text-white"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Kembali</span>
          </Button>
          {/* </Link> */}
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
      <div className="container mx-auto">
        <div className="flex items-center gap-4 mb-6">
          {/* <Link to={backLink}> */}
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white hover:text-white"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Kembali</span>
          </Button>
          {/* </Link> */}
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Detail Hafalan
          </h1>
        </div>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
            <CardDescription>
              {/* Gagal memuat data. {(error as Error)?.message || "Terjadi kesalahan."} */}
              Gagal memuat data detail hafalan.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const riwayatDetail = data?.data;

  if (!riwayatDetail) {
    return (
      <div className="container mx-auto">
        <div className="flex items-center gap-4 mb-6">
          {/* <Link to={backLink}> */}
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white hover:text-white"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Kembali</span>
          </Button>
          {/* </Link> */}
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Detail Hafalan
          </h1>
        </div>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Data Tidak Ditemukan</CardTitle>
            <CardDescription>
              Detail riwayat hafalan tidak tersedia.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="flex items-center gap-4 mb-6">
        {/* <Link to={backLink}> */}
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white hover:text-white"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Kembali</span>
        </Button>
        {/* </Link> */}
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Detail Hafalan
        </h1>
      </div>

      <Card className="bg-violet-600 text-white py-2">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            <p>
              Surah {riwayatDetail.surah.namaLatin} -{' '}
              <span className="text-md font-arabic">
                ({riwayatDetail.surah.nama})
              </span>
            </p>
            <div className="flex md:flex-row flex-col items-center gap-2 md:justify-center justify-between mt-2">
              <p className="text-base text-white order-2 md:order-1">
                {formatTanggalIndo(riwayatDetail.tanggal)}
              </p>
              <StatusBadge
                status={riwayatDetail.status}
                className="order-1 md:order-2"
              />
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-2 gap-2 md:gap-4 text-center sm:grid-cols-4 my-3">
        <div className="border bg-amber-100 border-violet-600/90 py-2 px-2 rounded-xl">
          <p className="font-semibold text-sm">Ustadz</p>
          <p className="text-wrap">{riwayatDetail.ustadz.nama}</p>
        </div>
        <div className="border bg-amber-100 border-violet-600/90 py-2 px-2 rounded-xl">
          <p className="font-semibold text-sm">Jumlah Ayat</p>
          <p className="text-wrap ">
            {riwayatDetail.daftarAyat.length} Ayat (
            {riwayatDetail.daftarAyat[0].nomorAyat} -{' '}
            {
              riwayatDetail.daftarAyat[riwayatDetail.daftarAyat.length - 1]
                .nomorAyat
            }
            )
          </p>
        </div>
        <div className="border bg-amber-100 border-violet-600/90 py-2 px-2 rounded-xl">
          <p className="font-semibold text-sm">Total Poin</p>
          <p className="text-wrap ">{riwayatDetail.totalPoin}</p>
        </div>
        <div className="border bg-amber-100 border-violet-600/90 py-2 px-2 rounded-xl">
          <p className="font-semibold text-sm">Catatan</p>
          <p className="text-wrap">{riwayatDetail.catatan || '-'}</p>
        </div>
      </div>

      <div className="space-y-2">
        {riwayatDetail.daftarAyat.map((ayat) => (
          <Card key={ayat.id} className="p-4 border border-violet-600/90">
            <div className="flex flex-col md:flex-row md:justify-between items-start">
              <span className="text-sm font-semibold text-violet-600 mb-2">
                {riwayatDetail.surah.namaLatin} Ayat {ayat.nomorAyat}
              </span>
              {ayat.keterangan && (
                <HafalanLabels
                  kualitas={ayat.kualitas}
                  keterangan={ayat.keterangan}
                  showKualitas={riwayatDetail.status === 'TambahHafalan'}
                  showHafalLabel={riwayatDetail.status === 'TambahHafalan'}
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
