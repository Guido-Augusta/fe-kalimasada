import { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Play, Pause, ChevronUp, ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useFetchSurahDetail } from "@/hooks/useAlquran";
import { AyatCardGeneral } from "./AyatCardGeneral";
import useUser from "@/store/useUser";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface Ayat {
  id: number;
  surah: number;
  nomor: number;
  ar: string;
  idn: string;
  tr: string;
  juz: number;
}

export default function ReadSurahAlquran() {
  const idSurah = Number(useParams().idSurah);
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const { data, isLoading, error } = useFetchSurahDetail(idSurah);
  const { user } = useUser();
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const [searchAyat, setSearchAyat] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const ayatRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchAyat);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchAyat]);

  useEffect(() => {
    if (debouncedSearch && data) {
      const ayatNumber = parseInt(debouncedSearch, 10);
      if (!isNaN(ayatNumber) && ayatNumber >= 1 && ayatNumber <= data.jumlah_ayat) {
        const targetAyat = data.ayat.find((a: Ayat) => a.nomor === ayatNumber);
        if (targetAyat && ayatRefs.current[targetAyat.id]) {
          const element = ayatRefs.current[targetAyat.id];
          if (element) {
            const headerOffset = 200;
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - headerOffset;
            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            });
          }
          setIsSearchDialogOpen(false);
          setSearchAyat("");
        } else {
          toast.error(`Ayat ${ayatNumber} tidak ditemukan`);
        }
      } else if (debouncedSearch) {
        toast.error(`Ayat harus antara 1 sampai ${data.jumlah_ayat}`);
      }
    }
  }, [debouncedSearch, data]);

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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto">
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
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-red-500">Gagal mengambil data surah. Coba lagi Nanti</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-gray-500">Data surah tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="mb-4">
        <Button onClick={() => navigate(-1)} variant="outline" className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-white hover:text-white">
          <ChevronLeft size={20} className="mr-2" /> Kembali
        </Button>
      </div>

      <div className="flex flex-row space-y-2 justify-between items-center mb-4">
        <Button onClick={togglePlay} variant="outline" className="bg-blue-500 hover:bg-blue-600 text-white hover:text-white">
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          <p className="ml-2">{isPlaying ? "Stop" : "Murottal"}</p>
        </Button>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2 font-arabic">{data.nama}</h1>
          <h2 className="text-xl font-medium font-arabic">{data.nama_latin}</h2>
        </div>
      </div>

      <div className="flex justify-between items-center my-4">
        <Link to={`/${user?.role}/alquran/surah/${data.nomor - 1 === 0 ? 114 : data.nomor - 1}`}>
          <Button variant="ghost" className="flex items-center text-blue-500 hover:text-blue-700">
            <ChevronLeft size={24} />
            <span className="ml-2 text-wrap">Surah Sebelumnya</span>
          </Button>
        </Link>
        <Link to={`/${user?.role}/alquran/surah/${data.nomor + 1 === 115 ? 1 : data.nomor + 1}`}>
          <Button variant="ghost" className="flex items-center text-blue-500 hover:text-blue-700">
            <span className="mr-2 text-wrap">Surah Selanjutnya</span>
            <ChevronRight size={24} />
          </Button>
        </Link>
        
        <audio
          ref={audioRef}
          src={data.audio}
          onEnded={() => setIsPlaying(false)}
        />
      </div>

      <div className="space-y-8">
        {data.ayat.map((ayat: Ayat) => (
          <div
            key={ayat.id}
            ref={(el) => { ayatRefs.current[ayat.id] = el; }}
          >
            <AyatCardGeneral ayat={ayat} />
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center my-4">
        <Link to={`/${user?.role}/alquran/surah/${data.nomor - 1 === 0 ? 114 : data.nomor - 1}`}>
          <Button variant="ghost" className="flex items-center text-blue-500 hover:text-blue-700">
            <ChevronLeft size={24} />
            <span className="ml-2 text-wrap">Surat Sebelumnya</span>
          </Button>
        </Link>
        <Link to={`/${user?.role}/alquran/surah/${data.nomor + 1 === 115 ? 1 : data.nomor + 1}`}>
          <Button variant="ghost" className="flex items-center text-blue-500 hover:text-blue-700">
            <span className="mr-2 text-wrap">Surat Selanjutnya</span>
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
          onClick={scrollToBottom}
          className="p-3 bg-violet-500 text-white rounded-full shadow-lg hover:bg-violet-600"
        >
          <ChevronDown size={24} />
        </Button>
      </div>

      <Dialog open={isSearchDialogOpen} onOpenChange={setIsSearchDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Cari Ayat</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2 py-4">
            <label className="text-sm font-medium text-gray-700">
              Nomor Ayat (1 - {data.jumlah_ayat})
            </label>
            <Input
              type="number"
              placeholder="Masukkan nomor ayat..."
              value={searchAyat}
              onChange={(e) => setSearchAyat(e.target.value)}
              min={1}
              max={data.jumlah_ayat}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
