import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronUp, ChevronDown, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useFetchJuzDetail, type JuzAyat } from "@/hooks/useAlquran";
import useUser from "@/store/useUser";
import { toArabicNumber } from "@/utils/formatArabNumber";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const BASMALLAH = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";

interface GroupedAyat {
  surahNomor: number;
  surahNama: string;
  surahNamaLatin: string;
  ayat: JuzAyat[];
}

export default function ReadJuzAlquran() {
  const idJuz = Number(useParams().idJuz);
  const navigate = useNavigate();
  const { data, isLoading, error } = useFetchJuzDetail(idJuz);
  const { user } = useUser();
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const [searchHalaman, setSearchHalaman] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const ayatRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchHalaman);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchHalaman]);

  useEffect(() => {
    if (debouncedSearch && data?.data) {
      const allAyat = data.data.ayat;
      const pages = allAyat.map((a) => a.halaman).filter((p): p is number => p !== undefined && p !== null);
      if (pages.length === 0) return;
      
      const minPage = Math.min(...pages);
      const maxPage = Math.max(...pages);
      const pageNumber = parseInt(debouncedSearch, 10);
      
      if (!isNaN(pageNumber) && pageNumber >= minPage && pageNumber <= maxPage) {
        const targetAyat = allAyat.find((a) => a.halaman === pageNumber);
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
          setSearchHalaman("");
        } else {
          toast.error(`Halaman ${pageNumber} tidak ditemukan`);
        }
      } else if (debouncedSearch) {
        const pages = data.data.ayat.map((a) => a.halaman).filter((p): p is number => p !== undefined && p !== null);
        if (pages.length > 0) {
          toast.error(`Halaman harus antara ${Math.min(...pages)} sampai ${Math.max(...pages)}`);
        }
      }
    }
  }, [debouncedSearch, data]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const groupAyatBySurah = (ayat: JuzAyat[]): GroupedAyat[] => {
    const grouped: GroupedAyat[] = [];
    let currentSurah: GroupedAyat | null = null;

    ayat.forEach((ayatItem) => {
      const surahNomor = ayatItem.surah.nomor;
      
      if (!currentSurah || currentSurah.surahNomor !== surahNomor) {
        currentSurah = {
          surahNomor,
          surahNama: ayatItem.surah.nama,
          surahNamaLatin: ayatItem.surah.nama_latin,
          ayat: []
        };
        grouped.push(currentSurah);
      }
      currentSurah.ayat.push(ayatItem);
    });

    return grouped;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto">
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <div className="space-y-6">
          {[...Array(5)].map((_, index) => (
            <Card key={index} className="p-4 border border-violet-600/90">
              <CardContent className="p-0">
                <Skeleton className="h-10 w-full mb-4" />
                <Skeleton className="h-4 w-2/3 mb-2" />
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
        <p className="text-red-500">Gagal mengambil data juz. Coba lagi nanti</p>
      </div>
    );
  }

  if (!data || !data.data) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-gray-500">Data juz tidak ditemukan.</p>
      </div>
    );
  }

  const juzData = data.data;
  const groupedAyat = groupAyatBySurah(juzData.ayat);
  const pages = juzData.ayat.map((a) => a.halaman).filter((p): p is number => p !== undefined && p !== null);
  const minPage = pages.length > 0 ? Math.min(...pages) : 1;
  const maxPage = pages.length > 0 ? Math.max(...pages) : 20;

  return (
    <div className="container mx-auto">
      <div className="mb-4">
        <Button 
          onClick={() => navigate(-1)} 
          variant="outline" 
          className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-white hover:text-white"
        >
          <ChevronLeft size={20} className="mr-2" /> Kembali
        </Button>
      </div>

      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-2 text-violet-600">Juz {juzData.juz}</h1>
        <p className="text-lg text-gray-600">
          Dimulai dari {juzData.mulai_dari.surah.nama_latin} ayat {juzData.mulai_dari.ayat}
        </p>
        <p className="text-sm text-gray-500">
          Total {juzData.total_ayat} ayat
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <Link to={`/${user?.role}/alquran/juz/${juzData.juz - 1 === 0 ? 30 : juzData.juz - 1}`}>
          <Button variant="ghost" className="flex items-center text-blue-500 hover:text-blue-700">
            <ChevronLeft size={24} />
            <span className="ml-2">Juz Sebelumnya</span>
          </Button>
        </Link>
        <Link to={`/${user?.role}/alquran/juz/${juzData.juz + 1 === 31 ? 1 : juzData.juz + 1}`}>
          <Button variant="ghost" className="flex items-center text-blue-500 hover:text-blue-700">
            <span className="mr-2">Juz Selanjutnya</span>
            <ChevronRight size={24} />
          </Button>
        </Link>
      </div>

      <div className="space-y-8">
        {groupedAyat.map((group, groupIndex) => (
          <div key={`${group.surahNomor}-${groupIndex}`}>
            {group.surahNomor !== 1 &&
              group.ayat[0]?.nomor_ayat === 1 && (
              <div className="text-center py-4">
                <p className="font-arabic text-2xl text-green-600 my-4">{BASMALLAH}</p>
              </div>
            )}

            <div className="bg-violet-100 rounded-lg p-4 mb-4 text-center flex items-center justify-center gap-6">
              <h2 className="text-xl font-bold text-violet-700">
                {group.surahNamaLatin}
              </h2>
              - 
              <p className="font-arabic text-2xl text-violet-600">{group.surahNama}</p>
            </div>

            <div className="space-y-8">
              {group.ayat.map((ayat) => (
                <Card 
                  key={ayat.id} 
                  ref={(el) => { ayatRefs.current[ayat.id] = el; }}
                  className="p-4 border border-violet-600/90"
                >
                  <p
                    className="text-right md:text-3xl text-2xl leading-14 md:leading-20 my-3 font-arabic"
                    dir="rtl"
                  >
                    {ayat.arab} 
                    <span className="mr-2 text-md font-arabic">
                      ۝{toArabicNumber(ayat.nomor_ayat)}
                    </span> 
                  </p>

                  <p className="text-left text-base text-green-600 italic">
                    {ayat.latin}
                  </p>

                  <p className="text-left text-base text-gray-800">
                    {ayat.terjemah}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center my-6">
        <Link to={`/${user?.role}/alquran/juz/${juzData.juz - 1 === 0 ? 30 : juzData.juz - 1}`}>
          <Button variant="ghost" className="flex items-center text-blue-500 hover:text-blue-700">
            <ChevronLeft size={24} />
            <span className="ml-2">Juz Sebelumnya</span>
          </Button>
        </Link>
        <Link to={`/${user?.role}/alquran/juz/${juzData.juz + 1 === 31 ? 1 : juzData.juz + 1}`}>
          <Button variant="ghost" className="flex items-center text-blue-500 hover:text-blue-700">
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
          onClick={scrollToBottom}
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
  );
}
