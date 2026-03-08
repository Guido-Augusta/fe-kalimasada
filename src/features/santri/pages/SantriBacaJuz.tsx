import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Search,
} from 'lucide-react';
import SantriLayout from '../components/SantriLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useFetchJuz } from '../hooks/useFetchJuz';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';
import { toArabicNumber } from '@/utils/formatArabNumber';
import { HafalanLabels } from '@/components/share/HafalanLabels';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const BASMALLAH = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';

export default function SantriBacaJuz() {
  const navigate = useNavigate();
  const { juzData, loading, error } = useFetchJuz();
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const [searchHalaman, setSearchHalaman] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const ayatRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const allAyat = useMemo(() => {
    if (!juzData?.surah) return [];
    return juzData.surah.flatMap((item) => item.ayat);
  }, [juzData]);

  const { minPage, maxPage } = useMemo(() => {
    if (allAyat.length === 0) return { minPage: 1, maxPage: 20 };
    const pages = allAyat
      .map((a) => a.halaman)
      .filter((p): p is number => p !== undefined && p !== null);
    if (pages.length === 0) return { minPage: 1, maxPage: 20 };
    return {
      minPage: Math.min(...pages),
      maxPage: Math.max(...pages),
    };
  }, [allAyat]);

  const scrollToAyat = (ayatId: number) => {
    const element = ayatRefs.current[ayatId];
    if (element) {
      const headerOffset = 200;
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchHalaman);
    }, 1500);

    return () => clearTimeout(timer);
  }, [searchHalaman]);

  useEffect(() => {
    if (debouncedSearch && allAyat.length > 0) {
      const pageNumber = parseInt(debouncedSearch, 10);
      if (
        !isNaN(pageNumber) &&
        pageNumber >= minPage &&
        pageNumber <= maxPage
      ) {
        const targetAyat = allAyat.find((a) => a.halaman === pageNumber);
        if (targetAyat) {
          scrollToAyat(targetAyat.id);
          setIsSearchDialogOpen(false);
          setSearchHalaman('');
        } else {
          toast.error(`Halaman ${pageNumber} tidak ditemukan`);
        }
      } else if (debouncedSearch) {
        toast.error(`Halaman harus antara ${minPage} sampai ${maxPage}`);
      }
    }
  }, [debouncedSearch, allAyat, minPage, maxPage]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const scrollToLastChecked = () => {
    if (juzData?.surah) {
      for (const surahGroup of [...juzData.surah].reverse()) {
        const lastCheckedAyat = [...surahGroup.ayat]
          .reverse()
          .find((ayat) => ayat.checked);
        if (lastCheckedAyat) {
          scrollToAyat(lastCheckedAyat.id);
          return;
        }
      }
    }
  };

  if (loading) {
    return (
      <SantriLayout>
        <div className="container mx-auto p-4">
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <div className="space-y-6">
            {[...Array(3)].map((_, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-8 w-1/3" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </SantriLayout>
    );
  }

  if (error) {
    return (
      <SantriLayout>
        <div className="container mx-auto p-4">
          <div className="mb-4">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="flex items-center bg-yellow-500 text-white hover:bg-yellow-600 hover:text-white"
            >
              <ChevronLeft size={20} className="mr-2" /> Kembali
            </Button>
          </div>
          <div className="flex justify-center items-center h-full">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </SantriLayout>
    );
  }

  if (!juzData) {
    return (
      <SantriLayout>
        <div className="container mx-auto p-4">
          <div className="mb-4">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="flex items-center bg-yellow-500 text-white hover:bg-yellow-600 hover:text-white"
            >
              <ChevronLeft size={20} className="mr-2" /> Kembali
            </Button>
          </div>
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">Data juz tidak ditemukan.</p>
          </div>
        </div>
      </SantriLayout>
    );
  }

  const currentJuz = juzData.juz;
  const prevJuz = currentJuz - 1 === 0 ? 30 : currentJuz - 1;
  const nextJuz = currentJuz + 1 === 31 ? 1 : currentJuz + 1;

  let lastRenderedPage = 0;

  return (
    <SantriLayout>
      <div className="container mx-auto p-2">
        <div className="mb-4">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="flex items-center bg-yellow-500 text-white hover:bg-yellow-600 hover:text-white"
          >
            <ChevronLeft size={20} className="mr-2" /> Kembali
          </Button>
        </div>

        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold mb-2 text-violet-600">
            Juz {juzData.juz}
          </h1>
          <p className="text-sm text-gray-500">
            Total {juzData.totalSurah} Surah
          </p>
        </div>

        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <Link to={`/santri/baca/juz/${prevJuz}`}>
            <Button
              variant="ghost"
              className="flex items-center text-blue-500 hover:text-blue-700"
            >
              <ChevronLeft size={20} />
              <span className="ml-1">Juz Sebelumnya</span>
            </Button>
          </Link>
          <Link to={`/santri/baca/juz/${nextJuz}`}>
            <Button
              variant="ghost"
              className="flex items-center text-blue-500 hover:text-blue-700"
            >
              <span className="mr-1">Juz Selanjutnya</span>
              <ChevronRight size={20} />
            </Button>
          </Link>
        </div>

        <div className="space-y-2">
          {juzData.surah.map((surahGroup, groupIndex) => {
            const isFirstAyat = surahGroup.ayat[0]?.nomorAyat === 1;
            const surahNomor = surahGroup.surah.nomor;

            return (
              <div key={`${surahGroup.surah.id}-${groupIndex}`}>
                {surahNomor !== 1 && isFirstAyat && (
                  <div className="text-center py-4">
                    <p className="font-arabic text-2xl text-green-600 my-4">
                      {BASMALLAH}
                    </p>
                  </div>
                )}

                <div className="bg-violet-100 rounded-lg p-4 mb-4 text-center flex items-center justify-center gap-6">
                  <h2 className="text-xl font-bold text-violet-700">
                    {surahGroup.surah.namaLatin}
                  </h2>
                  -
                  <p className="font-arabic text-2xl text-violet-600">
                    {surahGroup.surah.nama}
                  </p>
                </div>

                <div className="space-y-2">
                  {surahGroup.ayat.map((ayat) => {
                    const showPageHeader = ayat.halaman !== lastRenderedPage;

                    if (showPageHeader) {
                      lastRenderedPage = ayat.halaman;
                    }

                    return (
                      <div key={ayat.id}>
                        {showPageHeader && (
                          <div className="bg-amber-50 p-3 rounded-lg mb-2 border-l-4 border-violet-500 z-10">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-amber-700 uppercase tracking-wider">
                                Halaman {ayat.halaman}
                              </span>
                              <span className="text-sm text-gray-600">
                                Juz {juzData.juz}
                              </span>
                            </div>
                          </div>
                        )}

                        <div
                          ref={(el) => {
                            ayatRefs.current[ayat.id] = el;
                          }}
                          id={`ayat-${ayat.id}`}
                          className="p-4 border border-violet-600/90 rounded-lg bg-white"
                        >
                          {(() => {
                            return (
                              <div className="mb-2">
                                <HafalanLabels
                                  kualitas={ayat.kualitas}
                                  keterangan={ayat.keterangan}
                                  checked={ayat.checked}
                                />
                              </div>
                            );
                          })()}
                          <p
                            className="text-right md:text-3xl text-2xl leading-14 md:leading-20 font-arabic"
                            dir="rtl"
                          >
                            {ayat.arab}
                            <span className="mr-2 text-md font-arabic">
                              ۝{toArabicNumber(ayat.nomorAyat)}
                            </span>
                          </p>
                          <p className="text-left text-base text-green-600 italic mt-2">
                            {ayat.latin}
                          </p>
                          <p className="text-left text-base text-gray-800 mt-1">
                            {ayat.terjemah}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between items-center my-6">
          <Link to={`/santri/baca/juz/${prevJuz}`}>
            <Button
              variant="ghost"
              className="flex items-center text-blue-500 hover:text-blue-700"
            >
              <ChevronLeft size={24} />
              <span className="ml-2">Juz Sebelumnya</span>
            </Button>
          </Link>
          <Link to={`/santri/baca/juz/${nextJuz}`}>
            <Button
              variant="ghost"
              className="flex items-center text-blue-500 hover:text-blue-700"
            >
              <span className="mr-2">Juz Selanjutnya</span>
              <ChevronRight size={24} />
            </Button>
          </Link>
        </div>

        <div className="fixed bottom-8 right-8 flex flex-col space-y-2 z-50">
          <Button
            onClick={() => setIsSearchDialogOpen(true)}
            className="p-3 bg-amber-500 text-white rounded-full shadow-lg hover:bg-amber-600"
          >
            <Search size={24} />
          </Button>
          <Button
            onClick={scrollToTop}
            className="p-3 bg-violet-500 text-white rounded-full shadow-lg hover:bg-violet-600"
          >
            <ChevronUp size={24} />
          </Button>
          <Button
            onClick={scrollToLastChecked}
            className="p-3 bg-violet-500 text-white rounded-full shadow-lg hover:bg-violet-600"
          >
            <ChevronDown size={24} />
          </Button>
        </div>

        <Dialog open={isSearchDialogOpen} onOpenChange={setIsSearchDialogOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Cari Halaman</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-2 py-4">
              <label className="text-sm font-medium text-gray-700">
                Nomor Halaman ({minPage} - {maxPage})
              </label>
              <Input
                type="number"
                placeholder="Masukkan nomor halaman..."
                value={searchHalaman}
                onChange={(e) => setSearchHalaman(e.target.value)}
                min={minPage}
                max={maxPage}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </SantriLayout>
  );
}
