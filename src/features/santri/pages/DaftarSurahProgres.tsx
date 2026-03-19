import SantriLayout from "../components/SantriLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchProgress, type ModeType } from "../hooks/useFetchSurahList";
import { SurahCard } from "../components/SurahCard";
import { JuzCard } from "../components/JuzCard";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DaftarSurahProgres() {
  const [mode, setMode] = useState<ModeType>("surah");
  const { surahData, juzData, loading, error } = useFetchProgress(mode);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchInput.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const normalize = (text: string) =>
    text?.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]/g, "").trim();

  if (loading) {
    return (
      <SantriLayout>
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(9)].map((_, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-6 w-12 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-6 w-[200px]" />
                <Skeleton className="h-4 w-[100px] mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </SantriLayout>
    );
  }

  if (error) {
    return (
      <SantriLayout>
        <div className="flex justify-center items-center h-full">
          <p className="text-red-500">Data tidak ditemukan.</p>
        </div>
      </SantriLayout>
    );
  }

  const filteredSurah =
    surahData?.filter((surah) => {
      const latinName = normalize(surah.namaLatin || "");
      const arabicName = normalize(surah.nama || "");
      const query = normalize(debouncedSearchQuery);

      return latinName.includes(query) || arabicName.includes(query);
    }) ?? [];

  const filteredJuz =
    juzData?.filter((juz) => {
      const query = normalize(debouncedSearchQuery);
      if (!query) return true;

      const juzNumber = String(juz.juz);
      if (juzNumber.includes(query)) return true;

      if (juz.mulai_dari) {
        const surahName = normalize(juz.mulai_dari.surah.nama_latin || "");
        const surahArabic = normalize(juz.mulai_dari.surah.nama || "");
        if (surahName.includes(query) || surahArabic.includes(query)) return true;
      }

      return false;
    }) ?? [];

  return (
    <SantriLayout>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-4">
          {mode === "surah" ? "Daftar Surah" : "Daftar Juz"}
        </h1>

        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <Select
            value={mode}
            onValueChange={(value: ModeType) => setMode(value)}
          >
            <SelectTrigger className="w-[140px] bg-white">
              <SelectValue placeholder="Pilih Mode" />
            </SelectTrigger>
            <SelectContent className="">
              <SelectItem value="surah">Surah</SelectItem>
              <SelectItem value="juz">Juz</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative flex-grow max-w-sm bg-white">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={mode === "surah" ? "Cari nama surah..." : "Cari nomor juz atau surah..."}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mode === "surah" ? (
            filteredSurah.length > 0 ? (
              <>
                {filteredSurah.map((surah) => (
                  <SurahCard key={surah.id} surah={surah} />
                ))}
                <div className="py-2 md:py-0 group cursor-pointer rounded-2xl bg-violet-600/90 text-white flex items-center justify-center flex-col">
                  <Link to="/santri/doa-khatam-al-quran">
                    <h3 className="text-center font-bold text-xl text-wrap">
                      Doa Khatam Al-Qur'an
                    </h3>
                    <img
                      src="src/assets/al-quran.png"
                      alt=""
                      className="w-28 h-28 mx-auto"
                    />
                  </Link>
                </div>
              </>
            ) : (
              <p className="col-span-full text-center text-muted-foreground">
                Tidak ada surah yang ditemukan dengan nama "
                <span className="font-semibold">{debouncedSearchQuery}</span>".
              </p>
            )
          ) : filteredJuz.length > 0 ? (
            filteredJuz.map((juz) => <JuzCard key={juz.juz} juz={juz} />)
          ) : (
            <p className="col-span-full text-center text-muted-foreground">
              Tidak ada juz yang ditemukan dengan kata kunci "
              <span className="font-semibold">{debouncedSearchQuery}</span>".
            </p>
          )}
        </div>
      </div>
    </SantriLayout>
  );
}
