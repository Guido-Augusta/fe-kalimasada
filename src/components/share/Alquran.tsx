import { useState } from 'react';
import useUser from '@/store/useUser';
import {
  useFetchSurahListGeneral,
  type SurahGeneral,
} from '@/hooks/useAlquran';
import { juzList } from '@/data/juzList';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, BookOpen } from 'lucide-react';
import { SurahCardGeneral } from './SurahCardGeneral';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

export default function Alquran() {
  const { user } = useUser();
  const { data, isLoading, error } = useFetchSurahListGeneral();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'surah' | 'juz'>('surah');

  const normalize = (text: string) =>
    text
      ?.toLowerCase()
      ?.replace(/[^a-z0-9\u0600-\u06FF]/g, '')
      ?.trim() || '';

  if (isLoading) {
    return (
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

  const filteredJuzList = juzList.filter((juz) => {
    const query = normalize(searchQuery);
    const juzNumber = juz.juz.toString();
    const startSurahName = normalize(juz.startSurahName);
    const endSurahName = normalize(juz.endSurahName);

    return (
      juzNumber.includes(query) ||
      startSurahName.includes(query) ||
      endSurahName.includes(query)
    );
  });

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-violet-600">
        {viewMode === 'surah' ? 'Daftar Surah' : 'Daftar Juz'}
      </h1>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select
            value={viewMode}
            onValueChange={(value: 'surah' | 'juz') => {
              setViewMode(value);
              setSearchQuery('');
            }}
          >
            <SelectTrigger className="w-[140px] bg-white">
              <SelectValue placeholder="Pilih tipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="surah">Surah</SelectItem>
              <SelectItem value="juz">Juz</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
          <div className="relative flex-grow max-w-sm bg-white">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={
                viewMode === 'surah'
                  ? 'Cari nama surah (Fatihah)'
                  : 'Cari juz (1, 2, Al-Baqarah)'
              }
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
      </div>

      {viewMode === 'surah' ? (
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredJuzList.length > 0 ? (
            filteredJuzList.map((juz) => (
              <Link key={juz.juz} to={`/${user?.role}/alquran/juz/${juz.juz}`}>
                <Card className="group cursor-pointer rounded-2xl bg-violet-600/90 text-white hover:bg-violet-700/90 transition-colors">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <Badge
                      variant="outline"
                      className="rounded-full w-10 h-10 flex items-center justify-center font-semibold text-white"
                    >
                      {juz.juz}
                    </Badge>
                    <BookOpen className="h-5 w-5 text-white/80" />
                  </CardHeader>

                  <CardContent>
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-row items-center justify-between">
                        <h3 className="font-semibold text-lg">Juz {juz.juz}</h3>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm">
                          <span className="text-white/70">Dimulai:</span>{' '}
                          {juz.startSurahName} ({juz.startAyah})
                        </p>
                        <p className="text-sm">
                          <span className="text-white/70">Diakhiri:</span>{' '}
                          {juz.endSurahName} ({juz.endAyah})
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <p className="col-span-full text-center text-muted-foreground">
              Tidak ada juz yang ditemukan dengan kata kunci "
              <span className="font-semibold">{searchQuery}</span>".
            </p>
          )}
        </div>
      )}
    </div>
  );
}
