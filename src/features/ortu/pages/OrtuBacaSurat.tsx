import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  ChevronUp,
  ChevronDown,
  Search,
} from 'lucide-react';
import OrtuLayout from '../components/OrtuLayout';
import { Button } from '@/components/ui/button';
import { useFetchSurahOrtu } from '../hooks/useFetchSurahOrtu';
import { AyatCard } from '@/features/santri/components/AyatCard';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function OrtuBacaSurat() {
  const navigate = useNavigate();
  const { idSantri } = useParams<{ idSantri: string }>();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const { surahData, loading, error } = useFetchSurahOrtu();
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const [searchAyat, setSearchAyat] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    if (surahData && audioRef.current) {
      audioRef.current.src = surahData.surah.audio;
    }
  }, [surahData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchAyat);
    }, 1500);

    return () => clearTimeout(timer);
  }, [searchAyat]);

  useEffect(() => {
    if (debouncedSearch && surahData?.ayat) {
      const ayatNumber = parseInt(debouncedSearch, 10);
      if (
        !isNaN(ayatNumber) &&
        ayatNumber >= 1 &&
        ayatNumber <= surahData.surah.totalAyat
      ) {
        const targetAyat = surahData.ayat.find(
          (a) => a.nomorAyat === ayatNumber
        );
        if (targetAyat) {
          const element = document.getElementById(`ayat-${targetAyat.id}`);
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
          setIsSearchDialogOpen(false);
          setSearchAyat('');
        } else {
          toast.error(`Ayat ${ayatNumber} tidak ditemukan`);
        }
      } else if (debouncedSearch) {
        toast.error(`Ayat harus antara 1 sampai ${surahData.surah.totalAyat}`);
      }
    }
  }, [debouncedSearch, surahData]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const scrollToLastChecked = () => {
    if (surahData?.ayat) {
      const reversedAyat = [...surahData.ayat].reverse();
      const lastCheckedAyat = reversedAyat.find((ayat) => ayat.checked);

      if (lastCheckedAyat) {
        const element = document.getElementById(`ayat-${lastCheckedAyat.id}`);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }
    }
  };

  if (loading) {
    return (
      <OrtuLayout>
        <div className="container mx-auto">
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <div className="space-y-2">
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
      </OrtuLayout>
    );
  }

  if (error) {
    return (
      <OrtuLayout>
        <div className="container mx-auto">
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
      </OrtuLayout>
    );
  }

  if (!surahData) {
    return (
      <OrtuLayout>
        <div className="container mx-auto">
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
            <p className="text-gray-500">Data surah tidak ditemukan.</p>
          </div>
        </div>
      </OrtuLayout>
    );
  }

  return (
    <OrtuLayout>
      <div className="container mx-auto">
        <div className="mb-4">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="flex items-center bg-yellow-500 text-white hover:bg-yellow-600 hover:text-white"
          >
            <ChevronLeft size={20} className="mr-2" /> Kembali
          </Button>
        </div>

        <div className="flex flex-row space-y-2 justify-between items-center mb-4">
          <Button
            onClick={togglePlay}
            variant="outline"
            className="bg-blue-500 hover:bg-blue-600 text-white hover:text-white"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            <p className="ml-2">{isPlaying ? 'Stop' : 'Murottal'}</p>
          </Button>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2 font-arabic">
              {surahData.surah.nama}
            </h1>
            <h2 className="text-xl font-medium font-arabic">
              {surahData.surah.namaLatin}
            </h2>
          </div>
        </div>

        <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />

        <div className="flex justify-between items-center my-3">
          <Link
            to={`/ortu/hafalan/${idSantri}/${surahData.surah.nomor - 1 === 0 ? 114 : surahData.surah.nomor - 1}`}
          >
            <Button
              variant="ghost"
              className="flex items-center text-blue-500 hover:text-blue-700"
            >
              <ChevronLeft size={24} />
              <span className="ml-2 text-wrap">Surat Sebelumnya</span>
            </Button>
          </Link>
          <Link
            to={`/ortu/hafalan/${idSantri}/${surahData.surah.nomor + 1 === 115 ? 1 : surahData.surah.nomor + 1}`}
          >
            <Button
              variant="ghost"
              className="flex items-center text-blue-500 hover:text-blue-700"
            >
              <span className="mr-2 text-wrap">Surat Selanjutnya</span>
              <ChevronRight size={24} />
            </Button>
          </Link>
        </div>

        <div className="space-y-2">
          {surahData.ayat.map((ayat) => (
            <AyatCard key={ayat.id} ayat={ayat} surah={surahData.surah} />
          ))}
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
            onClick={() => scrollToLastChecked()}
            className="p-3 bg-violet-500 text-white rounded-full shadow-lg hover:bg-violet-600"
          >
            <ChevronDown size={24} />
          </Button>
        </div>

        <Dialog open={isSearchDialogOpen} onOpenChange={setIsSearchDialogOpen}>
          <DialogContent className="sm:max-w-100">
            <DialogHeader>
              <DialogTitle>Cari Ayat</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-2 py-4">
              <label className="text-sm font-medium text-gray-700">
                Nomor Ayat (1 - {surahData.surah.totalAyat})
              </label>
              <Input
                type="number"
                placeholder="Masukkan nomor ayat..."
                value={searchAyat}
                onChange={(e) => setSearchAyat(e.target.value)}
                min={1}
                max={surahData.surah.totalAyat}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </OrtuLayout>
  );
}
