import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Play, Pause, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useFetchSurahDetail } from "@/hooks/useAlquran";
import { AyatCardGeneral } from "./AyatCardGeneral";
import useUser from "@/store/useUser";

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
  const { user } = useUser()
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
          {/* <p className="text-red-500">{error.message}</p> */}
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
            <AyatCardGeneral key={ayat.id} ayat={ayat} />
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
      </div>
  );
}