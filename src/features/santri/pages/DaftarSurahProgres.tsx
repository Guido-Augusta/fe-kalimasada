import SantriLayout from "../components/SantriLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchSurahList } from "../hooks/useFetchSurahList";
import { SurahCard } from "../components/SurahCard";
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function DaftarSurahProgres() {
  const { surahData, loading, error } = useFetchSurahList();
  const [searchQuery, setSearchQuery] = useState("");

  const normalize = (text: string) =>
    text?.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]/g, "").trim();

  if (loading) {
    return (
      <SantriLayout>
        <div className="container mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
          {/* <p className="text-red-500">{error}</p> */}
          <p className="text-red-500">Data surah tidak ditemukan.</p>
        </div>
      </SantriLayout>
    );
  }

  const filteredSurah =
    surahData?.filter((surah) => {
      const latinName = normalize(surah.namaLatin || "");
      const arabicName = normalize(surah.nama || "");
      const query = normalize(searchQuery);

      return latinName.includes(query) || arabicName.includes(query);
    }) ?? [];

  return (
    <SantriLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Daftar Surah</h1>

        <div className="flex items-center gap-2 mb-6">
          <div className="relative flex-grow max-w-sm bg-white">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama surah..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button type="button" className="bg-yellow-500 hover:bg-yellow-600 text-white" onClick={() => setSearchQuery(searchQuery.trim())}>
            Cari
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredSurah.length > 0 ? (
            <>
            {filteredSurah.map((surah) => (
              <SurahCard key={surah.id} surah={surah} />
            ))}
              <div className="py-2 md:py-0 group cursor-pointer rounded-2xl bg-violet-600/90 text-white flex items-center justify-center flex-col">       
              <Link to="/santri/doa-khatam-al-quran">
                <h3 className="text-center font-bold text-xl text-wrap">Doa Khatam Al-Qur'an</h3>
                <img src="src/assets/al-quran.png" alt="" className="w-28 h-28 mx-auto" />
              </Link>
              </div>
            </>
          ) : (
            <p className="col-span-full text-center text-muted-foreground">
              Tidak ada surah yang ditemukan dengan nama "
              <span className="font-semibold">{searchQuery}</span>".
            </p>
          )}
        </div>
        
      </div>
    </SantriLayout>
  );
}