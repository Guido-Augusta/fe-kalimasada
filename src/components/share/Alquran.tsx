import { useState } from "react";
import useUser from "@/store/useUser";
import { useFetchSurahListGeneral, type SurahGeneral } from "@/hooks/useAlquran";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { SurahCardGeneral } from "./SurahCardGeneral";

export default function Alquran() {
  const { user } = useUser();
  const { data, isLoading, error } = useFetchSurahListGeneral();
  const [searchQuery, setSearchQuery] = useState("");

  const normalize = (text: string) =>
    text
      ?.toLowerCase()
      ?.replace(/[^a-z0-9\u0600-\u06FF]/g, "")
      ?.trim() || "";

  if (isLoading) {
    return (
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
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">Gagal memuat data surah.</p>
      </div>
    );
  }

  const surahList: SurahGeneral[] = data?.data || [];

  const filteredSurahList = surahList.filter((surah) => {
    const latinName = normalize(surah.namaLatin);
    const arabicName = normalize(surah.nama);
    const query = normalize(searchQuery);

    return latinName.includes(query) || arabicName.includes(query);
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-violet-600">Daftar Surah</h1>

      <div className="flex items-center gap-2 mb-6">
        <div className="relative flex-grow max-w-sm bg-white">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama surah (misal: Fatihah)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          type="button"
          className="bg-yellow-500 hover:bg-yellow-600 text-white"
          onClick={() => setSearchQuery(searchQuery.trim())}
        >
          Cari
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredSurahList.length > 0 ? (
          filteredSurahList.map((surah) => (
            <SurahCardGeneral
              key={surah.id}
              surah={surah}
              role={user?.role as string}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-muted-foreground">
            Tidak ada surah yang ditemukan dengan nama "
            <span className="font-semibold">{searchQuery}</span>".
          </p>
        )}
      </div>
    </div>
  );
}
