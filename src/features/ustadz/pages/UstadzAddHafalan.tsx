import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import UstadzLayout from '../components/UstadzLayout';
import {
  ArrowLeft,
  Loader2,
  ChevronUp,
  ChevronDown,
  Check,
  X,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-hot-toast';
import {
  useFetchAddHafalanData,
  useSaveHafalan,
} from '../hooks/useHafalanData';
import { Input } from '@/components/ui/input';
import type { HafalanMode } from '../types/hafalan.type';
import { toArabicNumber } from '@/utils/formatArabNumber';
import { useNavigate } from 'react-router-dom';

export default function UstadzAddHafalan() {
  const navigate = useNavigate();
  const { idSantri, idSurah } = useParams<{
    idSantri: string;
    idSurah: string;
  }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mode, setMode] = useState<HafalanMode>(
    (searchParams.get('mode') as HafalanMode) || 'tambah'
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [catatan, setCatatan] = useState('');
  const [startAyat, setStartAyat] = useState(0);
  const [endAyat, setEndAyat] = useState(0);
  const [searchAyat, setSearchAyat] = useState('');
  const [debouncedSearchAyat, setDebouncedSearchAyat] = useState('');

  const ayatRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const {
    data,
    isLoading,
    isError,
    error: _error,
  } = useFetchAddHafalanData(idSantri!, idSurah!, mode);
  const { mutate: saveHafalan, isPending: isSaving } = useSaveHafalan();

  const handleSearchAyat = () => {
    if (!searchAyat || !data?.ayat) return;

    const ayatNumber = parseInt(searchAyat, 10);
    if (
      !isNaN(ayatNumber) &&
      ayatNumber >= 1 &&
      ayatNumber <= data.ayat.length
    ) {
      const targetAyat = data.ayat.find((a) => a.nomorAyat === ayatNumber);
      if (targetAyat && ayatRefs.current[targetAyat.id]) {
        ayatRefs.current[targetAyat.id]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      } else {
        toast.error(`Ayat ${ayatNumber} tidak ditemukan`);
      }
    } else {
      toast.error(`Ayat harus antara 1 sampai ${data.ayat.length}`);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchAyat(searchAyat);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchAyat]);

  useEffect(() => {
    if (debouncedSearchAyat && data?.ayat) {
      const ayatNumber = parseInt(debouncedSearchAyat, 10);
      if (
        !isNaN(ayatNumber) &&
        ayatNumber >= 1 &&
        ayatNumber <= data.ayat.length
      ) {
        const targetAyat = data.ayat.find((a) => a.nomorAyat === ayatNumber);
        if (targetAyat && ayatRefs.current[targetAyat.id]) {
          ayatRefs.current[targetAyat.id]?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        } else {
          toast.error(`Ayat ${ayatNumber} tidak ditemukan`);
        }
      } else if (debouncedSearchAyat) {
        toast.error(`Ayat harus antara 1 sampai ${data.ayat.length}`);
      }
    }
  }, [debouncedSearchAyat, data?.ayat]);

  useEffect(() => {
    if (data) {
      setStartAyat(0);
      setEndAyat(0);
    }

    if (data?.ayat?.length) {
      const lastCheckedAyat = [...data.ayat]
        .reverse()
        .find((ayat) => ayat.checked);

      if (lastCheckedAyat) {
        const element =
          ayatRefs.current[lastCheckedAyat.id as keyof typeof ayatRefs.current];
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  }, [data]);

  const handleTabChange = (newMode: HafalanMode) => {
    setMode(newMode);
    setSearchParams({ mode: newMode });
  };

  const handleSaveClick = () => {
    setIsDialogOpen(true);
  };

  const handleSubmitHafalan = async () => {
    if (!data) {
      toast.error('Data hafalan tidak tersedia. Mohon coba lagi.');
      setIsDialogOpen(false);
      return;
    }

    const totalAyat = data.ayat.length;

    if (
      startAyat <= 0 ||
      endAyat <= 0 ||
      startAyat > totalAyat ||
      endAyat > totalAyat ||
      startAyat > endAyat
    ) {
      toast.error(
        'Input ayat tidak valid. Pastikan Ayat Mulai dan Ayat Selesai benar.'
      );
      setIsDialogOpen(false);
      return;
    }

    const startIndex = startAyat - 1;
    const endIndex = endAyat;

    const ayatIdsToAdd = data.ayat
      .slice(startIndex, endIndex)
      .map((ayat) => ayat.id);

    if (ayatIdsToAdd.length === 0) {
      toast.error('Tidak ada ayat yang bisa ditambahkan.');
      setIsDialogOpen(false);
      return;
    }

    const payload = {
      santriId: parseInt(idSantri!),
      ayatIds: ayatIdsToAdd,
      status: (mode === 'tambah' ? 'TambahHafalan' : 'Murajaah') as
        | 'TambahHafalan'
        | 'Murajaah',
      catatan: catatan,
    };

    saveHafalan(payload, {
      onSuccess: () => {
        toast.success(
          mode === 'tambah'
            ? 'Ayat berhasil ditambahkan ke hafalan.'
            : 'Ayat berhasil dimurajaahkan.'
        );
        setIsDialogOpen(false);
        setStartAyat(0);
        setEndAyat(0);
        setCatatan('');
      },
      onError: (_e) => {
        toast.error('Gagal menyimpan hafalan. Terjadi kesalahan.');
      },
    });
  };

  const today = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  });

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToLastChecked = () => {
    if (!data || !data.ayat) return;
    const lastCheckedAyat = data.ayat
      .slice()
      .reverse()
      .find((ayat) => ayat.checked);
    if (lastCheckedAyat) {
      const element = ayatRefs.current[lastCheckedAyat.id];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  if (isLoading) {
    return (
      <UstadzLayout>
        <div className="container mx-auto p-4 max-w-4xl">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 hover:text-white text-white"
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
            <p className="ml-2">Memuat data hafalan...</p>
          </div>
        </div>
      </UstadzLayout>
    );
  }

  if (isError) {
    return (
      <UstadzLayout>
        <div className="container mx-auto p-4 max-w-4xl">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 hover:text-white text-white"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Kembali</span>
            </Button>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Detail Hafalan
            </h1>
          </div>
          <div className="flex justify-center items-center text-red-500">
            {/* <p>Error: {(error as Error)?.message}</p> */}
            <p>Gagal memuat data hafalan.</p>
          </div>
        </div>
      </UstadzLayout>
    );
  }

  return (
    <UstadzLayout>
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 hover:text-white text-white"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Kembali</span>
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Detail Hafalan
          </h1>
        </div>

        <div className="flex justify-center items-start min-h-screen shadow-lg">
          <div className="w-full max-w-4xl">
            <div className="sticky top-16 p-6 z-10 shadow-md rounded-lg bg-amber-100">
              <div className="flex items-center gap-2 mb-4">
                <Button
                  variant={mode === 'tambah' ? 'default' : 'outline'}
                  onClick={() => handleTabChange('tambah')}
                  className={
                    mode === 'tambah'
                      ? 'bg-violet-600 text-white hover:bg-violet-700 font-semibold'
                      : 'text-violet-600 border-violet-600 hover:bg-violet-600 hover:text-white'
                  }
                >
                  Tambah Hafalan
                </Button>
                <Button
                  variant={mode === 'murajaah' ? 'default' : 'outline'}
                  onClick={() => handleTabChange('murajaah')}
                  className={
                    mode === 'murajaah'
                      ? 'bg-violet-600 text-white hover:bg-violet-700 font-semibold'
                      : 'text-violet-600 border-violet-600 hover:bg-violet-600 hover:text-white'
                  }
                >
                  Murajaah
                </Button>
              </div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div className="mb-4 md:mb-0">
                  <CardTitle className="text-xl md:text-2xl font-bold">
                    Nama Surat : {data?.surah.namaLatin} -{' '}
                    <span className="font-arabic">{data?.surah.nama}</span>
                  </CardTitle>
                  <CardDescription className="text-sm md:text-base">
                    Tgl : {today} (hari ini)
                  </CardDescription>
                </div>
                <Button
                  variant="default"
                  disabled={isSaving}
                  onClick={handleSaveClick}
                  className="bg-violet-600 text-white hover:bg-violet-700"
                >
                  Tambah
                </Button>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1 md:flex-none">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="number"
                    placeholder={`Cari ayat (1-${data?.ayat.length || 0})...`}
                    value={searchAyat}
                    onChange={(e) => setSearchAyat(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearchAyat();
                      }
                    }}
                    className="pl-10 w-full md:w-64 bg-white"
                    min="1"
                    max={data?.ayat.length}
                  />
                </div>
                <Button
                  onClick={handleSearchAyat}
                  className="bg-violet-600 text-white hover:bg-violet-700"
                >
                  Cari
                </Button>
              </div>
            </div>

            <div className="bg-white p-2 rounded-b-lg">
              <div className="space-y-4">
                {data?.ayat.map((ayat) => (
                  <div
                    key={ayat.id}
                    ref={(el) => {
                      ayatRefs.current[ayat.id] = el;
                    }}
                    className="flex items-center gap-4 p-4 border border-violet-600/90 rounded-lg bg-white"
                  >
                    <p
                      className="flex-1 text-right md:text-3xl text-2xl leading-14 md:leading-20 font-arabic"
                      style={{ fontFamily: 'Amiri, serif' }}
                      dir="rtl"
                    >
                      {ayat.arab}
                      <span className="mr-2 text-md font-arabic">
                        ۝{toArabicNumber(ayat.nomorAyat)}
                      </span>
                    </p>
                    {mode === 'tambah' &&
                      (ayat.checked ? (
                        <Check className="h-6 w-6 text-green-500" />
                      ) : (
                        <X className="h-6 w-6 text-red-500" />
                      ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Catatan dan Jumlah Ayat</DialogTitle>
            <DialogDescription>
              Masukkan ayat yang {mode === "tambah" ? "dihafal" : "dimuraja'ah"}, serta catatan
              (opsional).
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startAyat" className="text-right">
                  Ayat Mulai
                </Label>
                <Input
                  id="startAyat"
                  type="number"
                  value={startAyat}
                  onChange={(e) => setStartAyat(parseInt(e.target.value) || 0)}
                  className="col-span-3"
                  min="1"
                  max={data?.ayat.length}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endAyat" className="text-right">
                  Ayat Selesai
                </Label>
                <Input
                  id="endAyat"
                  type="number"
                  value={endAyat}
                  onChange={(e) => setEndAyat(parseInt(e.target.value) || 0)}
                  className="col-span-3"
                  min="1"
                  max={data?.ayat.length}
                />
              </div>
            </>
            <Textarea
              id="catatan"
              placeholder="Masukkan catatan di sini..."
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              className="col-span-4"
            />
          </div>
          <DialogFooter>
            <Button
              onClick={() => setIsDialogOpen(false)}
              variant="outline"
              disabled={isSaving}
              className="bg-destructive text-white hover:bg-destructive/80 hover:text-white"
            >
              Batal
            </Button>
            <Button
              onClick={handleSubmitHafalan}
              disabled={
                isSaving ||
                startAyat <= 0 ||
                endAyat <= 0 ||
                startAyat > endAyat
              }
              className="bg-green-600 text-white hover:bg-green-700"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2">
        <Button
          className="p-3 bg-violet-500 text-white rounded-full shadow-lg hover:bg-violet-600"
          onClick={handleScrollToTop}
          aria-label="Scroll ke atas"
        >
          <ChevronUp className="h-6 w-6" />
        </Button>
        <Button
          className="p-3 bg-violet-500 text-white rounded-full shadow-lg hover:bg-violet-600"
          onClick={handleScrollToLastChecked}
          disabled={!data?.ayat.some((ayat) => ayat.checked)}
          aria-label="Scroll ke ayat terakhir yang dicentang"
        >
          <ChevronDown className="h-6 w-6" />
        </Button>
      </div>
    </UstadzLayout>
  );
}
