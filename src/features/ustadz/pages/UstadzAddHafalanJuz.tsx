import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import UstadzLayout from '../components/UstadzLayout';
import {
  ArrowLeft,
  Loader2,
  ChevronUp,
  ChevronDown,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'react-hot-toast';
import {
  useFetchJuzHafalanData,
  useSaveHafalanByHalaman,
} from '../hooks/useHafalanData';
import { Input } from '@/components/ui/input';
import type { HafalanMode, HafalanStatus, SaveHafalanResponse } from '../types/hafalan.type';
import { toArabicNumber } from '@/utils/formatArabNumber';
import { useNavigate } from 'react-router-dom';
import { HafalanLabels } from '@/components/share/HafalanLabels';

const TOTAL_PAGES_IN_JUZ = 20;

export default function UstadzAddHafalanJuz() {
  const navigate = useNavigate();
  const { idSantri, idJuz } = useParams<{
    idSantri: string;
    idJuz: string;
  }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mode, setMode] = useState<HafalanMode>(
    (searchParams.get('mode') as HafalanMode) || 'tambah'
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [catatan, setCatatan] = useState('');
  const [kualitas, setKualitas] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [startHalaman, setStartHalaman] = useState(0);
  const [endHalaman, setEndHalaman] = useState(0);
  const [searchHalaman, setSearchHalaman] = useState('');
  const [debouncedSearchHalaman, setDebouncedSearchHalaman] = useState('');

  const ayatRefs = useRef<Record<number, HTMLDivElement | null>>({});

  let lastRenderedPage = 0;

  const {
    data,
    isLoading,
    isError,
    error: _error,
  } = useFetchJuzHafalanData(idSantri!, idJuz!, mode);
  const { mutate: saveHafalanByHalaman, isPending: isSaving } =
    useSaveHafalanByHalaman();

  const allAyat = useMemo(() => {
    if (!data?.surah) return [];
    return data.surah.flatMap((item) => item.ayat);
  }, [data]);

  const { minPage, maxPage } = useMemo(() => {
    if (allAyat.length === 0) return { minPage: 1, maxPage: TOTAL_PAGES_IN_JUZ };
    const pages = allAyat.map((a) => a.halaman).filter((p): p is number => p !== undefined && p !== null);
    if (pages.length === 0) return { minPage: 1, maxPage: TOTAL_PAGES_IN_JUZ };
    return {
      minPage: Math.min(...pages),
      maxPage: Math.max(...pages),
    };
  }, [allAyat]);

  const handleSearchHalaman = () => {
    if (!searchHalaman || allAyat.length === 0) return;

    const pageNumber = parseInt(searchHalaman, 10);
    if (
      !isNaN(pageNumber) &&
      pageNumber >= minPage &&
      pageNumber <= maxPage
    ) {
      const targetAyat = allAyat.find((a) => a.halaman === pageNumber);
      if (targetAyat && ayatRefs.current[targetAyat.id]) {
        const element = ayatRefs.current[targetAyat.id];
        if (element) {
          const headerOffset = 350;
          const elementPosition =
            element.getBoundingClientRect().top + window.scrollY;

          const offsetPosition = elementPosition - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
      } else {
        toast.error(`Halaman ${pageNumber} tidak ditemukan`);
      }
    } else {
      toast.error(`Halaman harus antara ${minPage} sampai ${maxPage}`);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchHalaman(searchHalaman);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchHalaman]);

  useEffect(() => {
    if (debouncedSearchHalaman && allAyat.length > 0) {
      const pageNumber = parseInt(debouncedSearchHalaman, 10);
      if (
        !isNaN(pageNumber) &&
        pageNumber >= minPage &&
        pageNumber <= maxPage
      ) {
        const targetAyat = allAyat.find((a) => a.halaman === pageNumber);
        if (targetAyat && ayatRefs.current[targetAyat.id]) {
          const element = ayatRefs.current[targetAyat.id];
          if (element) {
            const headerOffset = 350;
            const elementPosition =
              element.getBoundingClientRect().top + window.scrollY;

            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth',
            });
          }
        } else {
          toast.error(`Halaman ${pageNumber} tidak ditemukan`);
        }
      } else if (debouncedSearchHalaman) {
        toast.error(`Halaman harus antara ${minPage} sampai ${maxPage}`);
      }
    }
  }, [debouncedSearchHalaman, allAyat, minPage, maxPage]);

  useEffect(() => {
    if (data) {
      setStartHalaman(0);
      setEndHalaman(0);
    }

    if (allAyat.length > 0) {
      const lastCheckedAyat = [...allAyat]
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
  }, [data, allAyat]);

  const handleTabChange = (newMode: HafalanMode) => {
    setMode(newMode);
    setSearchParams({ mode: newMode });
  };

  const handleSaveClick = () => {
    setIsDialogOpen(true);
  };

  const handleSubmitHafalan = async () => {
    if (!data || allAyat.length === 0) {
      toast.error('Data hafalan tidak tersedia. Mohon coba lagi.');
      setIsDialogOpen(false);
      return;
    }

    if (
      startHalaman <= 0 ||
      endHalaman <= 0 ||
      startHalaman < minPage ||
      endHalaman > maxPage ||
      startHalaman > endHalaman
    ) {
      toast.error(
        `Input halaman tidak valid. Pastikan Halaman Mulai dan Halaman Selesai benar (${minPage}-${maxPage}).`
      );
      setIsDialogOpen(false);
      return;
    }

    // Validasi kualitas untuk mode TambahHafalan
    if (mode === 'tambah' && !kualitas) {
      toast.error('Pilih kualitas hafalan terlebih dahulu.');
      return;
    }

    // Validasi keterangan untuk semua mode
    if (!keterangan) {
      toast.error('Pilih keterangan terlebih dahulu.');
      return;
    }

    const MODE_TO_STATUS: Record<HafalanMode, HafalanStatus> = {
      tambah: 'TambahHafalan',
      murajaah: 'Murajaah',
      tahsin: 'Tahsin',
    };

    const payload = {
      santriId: parseInt(idSantri!),
      halamanAwal: startHalaman,
      halamanAkhir: endHalaman,
      status: MODE_TO_STATUS[mode],
      ...(mode === 'tambah' && { kualitas }),
      keterangan,
      catatan: catatan,
    };

    saveHafalanByHalaman(payload, {
      onSuccess: (_data: SaveHafalanResponse) => {
        toast.success(
          mode === 'tambah'
            ? 'Hafalan halaman berhasil ditambahkan.'
            : mode === 'murajaah'
              ? 'Murajaah halaman berhasil ditambahkan.'
              : 'Tahsin halaman berhasil ditambahkan.'
        );
        setIsDialogOpen(false);
        setStartHalaman(0);
        setEndHalaman(0);
        setCatatan('');
        setKualitas('');
        setKeterangan('');
      },
      onError: (_e) => {
        console.error(_e);
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
    if (allAyat.length === 0) return;
    const lastCheckedAyat = [...allAyat].reverse().find((ayat) => ayat.checked);
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
          <div className="flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="ml-2">Memuat data hafalan juz...</p>
          </div>
        </div>
      </UstadzLayout>
    );
  }

  if (isError) {
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
          <div className="flex justify-center items-center text-red-500">
            <p>Gagal memuat data hafalan juz.</p>
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
                <Button
                  variant={mode === 'tahsin' ? 'default' : 'outline'}
                  onClick={() => handleTabChange('tahsin')}
                  className={
                    mode === 'tahsin'
                      ? 'bg-violet-600 text-white hover:bg-violet-700 font-semibold'
                      : 'text-violet-600 border-violet-600 hover:bg-violet-600 hover:text-white'
                  }
                >
                  Tahsin
                </Button>
              </div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div className="mb-4 md:mb-0">
                  <CardTitle className="text-xl md:text-2xl font-bold">
                    Juz {data?.juz}
                  </CardTitle>
                  <CardDescription className="text-sm md:text-base">
                    Total {data?.totalSurah} Surah • Tgl : {today} (hari ini)
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
                    placeholder={`Cari halaman (${minPage}-${maxPage})...`}
                    value={searchHalaman}
                    onChange={(e) => setSearchHalaman(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearchHalaman();
                      }
                    }}
                    className="pl-10 w-full md:w-64 bg-white"
                    min={minPage}
                    max={maxPage}
                  />
                </div>
                <Button
                  onClick={handleSearchHalaman}
                  className="bg-violet-600 text-white hover:bg-violet-700"
                >
                  Cari
                </Button>
              </div>
            </div>

            <div className="bg-white p-2 rounded-b-lg">
              <div className="space-y-4">
                {data?.surah.map((surahData) => (
                  <div key={surahData.surah.id}>                    
                    <div className="space-y-2">
                      {surahData.ayat.map((ayat, index) => {
                        const showPageHeader = ayat.halaman !== lastRenderedPage;
                        const isFirstAyatOfSurah = index === 0;

                        if (showPageHeader) {
                          lastRenderedPage = ayat.halaman as number;
                        }

                        return (
                          <div key={ayat.id}>
                            {isFirstAyatOfSurah && (
                              <div className="bg-gradient-to-r from-violet-100 to-amber-50 p-4 rounded-lg mb-3 border-l-4 border-violet-600">
                                <div className="flex items-center justify-between">
                                <h3 className="font-bold text-xl text-violet-800">
                                  {surahData.surah.namaLatin}
                                </h3>
                                <p className="md:text-4xl text-2xl text-violet-600 font-arabic" style={{ fontFamily: 'Amiri, serif' }} dir="rtl">
                                  {surahData.surah.nama}
                                </p>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                  {surahData.ayat.length} Ayat
                                </p>
                              </div>
                            )}

                            {showPageHeader && (
                              <div className="sticky top-32 bg-amber-50 p-3 rounded-lg mb-2 border-l-4 border-violet-500 z-[5]">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-bold text-amber-700 uppercase tracking-wider">
                                    Halaman {ayat.halaman}
                                  </span>
                                  <span className="text-sm text-gray-600">
                                    Juz {data.juz}
                                  </span>
                                </div>
                              </div>
                            )}

                            <div
                              ref={(el) => {
                                ayatRefs.current[ayat.id] = el;
                              }}
                              className="flex flex-col gap-2 p-4 border border-violet-600/90 rounded-lg bg-white mb-2"
                            >
                              {(() => {
                                // Only display labels from API response, ignore submitted state
                                const displayKualitas = ayat.kualitas || '';
                                const displayKeterangan = ayat.keterangan || '';

                                return displayKeterangan ? (
                                  <HafalanLabels
                                    kualitas={displayKualitas}
                                    keterangan={displayKeterangan}
                                    showKualitas={mode === 'tambah'}
                                    showHafalLabel={mode === 'tambah'}
                                  />
                                ) : null;
                              })()}
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
                            </div>
                          </div>
                        );
                      })}
                    </div>
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
            <DialogTitle>Catatan dan Rentang Halaman</DialogTitle>
            <DialogDescription>
              Masukkan rentang halaman yang{' '}
               {mode === 'tambah' ? 'dihafal' : mode === 'murajaah' ? "dimuraja'ah" : 'di-tahsin-kan'}, serta catatan
              (opsional).
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startHalaman" className="text-right">
                  Halaman Mulai
                </Label>
                <Input
                  id="startHalaman"
                  type="number"
                  value={startHalaman}
                  onChange={(e) =>
                    setStartHalaman(parseInt(e.target.value) || 0)
                  }
                  className="col-span-3"
                  min={minPage}
                  max={maxPage}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endHalaman" className="text-right">
                  Halaman Selesai
                </Label>
                <Input
                  id="endHalaman"
                  type="number"
                  value={endHalaman}
                  onChange={(e) => setEndHalaman(parseInt(e.target.value) || 0)}
                  className="col-span-3"
                  min={minPage}
                  max={maxPage}
                />
              </div>
              {mode === 'tambah' && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="kualitas" className="text-right">
                    Kualitas
                  </Label>
                  <Select value={kualitas} onValueChange={setKualitas}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Pilih kualitas..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Kurang">Kurang</SelectItem>
                      <SelectItem value="Cukup">Cukup</SelectItem>
                      <SelectItem value="Baik">Baik</SelectItem>
                      <SelectItem value="SangatBaik">Sangat Baik</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="keterangan" className="text-right">
                  Keterangan
                </Label>
                <Select value={keterangan} onValueChange={setKeterangan}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Pilih keterangan..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mengulang">Mengulang</SelectItem>
                    <SelectItem value="Lanjut">Lanjut</SelectItem>
                  </SelectContent>
                </Select>
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
                startHalaman <= 0 ||
                endHalaman <= 0 ||
                startHalaman > endHalaman ||
                (mode === 'tambah' && !kualitas) ||
                !keterangan
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
          disabled={!allAyat.some((ayat) => ayat.checked)}
          aria-label="Scroll ke ayat terakhir yang dicentang"
        >
          <ChevronDown className="h-6 w-6" />
        </Button>
      </div>
    </UstadzLayout>
  );
}
