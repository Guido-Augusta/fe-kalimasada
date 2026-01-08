import { useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatTahapHafalan } from "@/utils/tahapHafalan";
import OrtuLayout from "../components/OrtuLayout";
import { useHafalanProgressData } from "@/features/ustadz/hooks/useHafalanData";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function OrtuProgressHafalan() {
  const { idSantri } = useParams<{ idSantri: string }>();
  const { data, isLoading, isError, error: _error } = useHafalanProgressData(idSantri as string);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const santri = data?.santri;
  const surahList = data?.data || [];

  const filteredSurah = surahList?.filter((surah) =>
    surah.namaLatin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getProgressColorClass = (progress: number) => {
    if (progress < 50) {
      return 'bg-red-500';
    } else if (progress < 100) {
      return 'bg-yellow-500'; 
    } else {  
      return 'bg-green-500'; 
    }
  };

  const today = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });

  return (
    <OrtuLayout>
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="flex items-center gap-4 mb-6">
          {/* <Link to="/ortu"> */}
            <Button variant="outline" size="sm" className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 hover:text-white text-white" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Kembali</span>
            </Button>
          {/* </Link> */}
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Detail Hafalan</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-6 gap-2 mb-6">
          <Card className="bg-violet-600 text-white">
            <CardContent>
              <p className="font-semibold">Nama : </p> 
              <p className="font-semibold">{santri?.nama}</p>
            </CardContent>
          </Card>

          <Card className="bg-violet-600 text-white">
            <CardContent>
              <p className="font-semibold">Tahap Hafalan : </p> 
              <p className="font-semibold">{formatTahapHafalan(santri?.tahapHafalan as string)}</p>
            </CardContent>
          </Card>

          <Card className="bg-violet-600 text-white">
            <CardContent>
              <p className="font-semibold">Tanggal : </p> 
              <p className="font-semibold">{today.replaceAll("/", "-")}</p>
            </CardContent>
          </Card>
        </div>

        { isLoading ? (
          <div className="flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="ml-2">Memuat...</p>
          </div>
        ) : isError ? (
          <div className="flex justify-center items-center text-red-500">
            {/* <p>Error: {error?.message}</p> */}
            <p>Gagal memuat data progres hafalan.</p>
          </div>
        ) : !data ? (
          <div className="flex justify-center items-center text-muted-foreground">
            <p>Data progres hafalan tidak ditemukan.</p>
          </div>
        ) : (
          <Card className="mt-6">
            <CardHeader className="flex md:flex-row flex-col gap-2 justify-between">
              <div> 
                <CardTitle>Daftar Surat</CardTitle>
                <CardDescription>Progres hafalan surat-surat Al-Qur'an.</CardDescription>
              </div>
              <div className="flex items-center gap-2 md:mt-0 mt-2">
                <div className="relative flex-grow max-w-sm bg-white">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Cari nama surah..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button type="button" className="bg-yellow-500 hover:bg-yellow-600 text-white">
                  Cari
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    {/* <TableHead className="w-[100px] text-center">No</TableHead> */}
                    <TableHead className="w-[100px] text-center">Nama Surah</TableHead>
                    <TableHead className="text-center hidden md:table-cell">Jumlah Ayat</TableHead>
                    <TableHead className="text-center">Status Hafalan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                {filteredSurah?.length > 0 ? (
                  filteredSurah.map((surah) => {
                    const [current, total] = surah.progress.split('/').map(Number);
                    const progressValue = (current / total) * 100;
                    return (
                      <TableRow key={surah.id}>
                        {/* <TableCell className="font-medium text-center">{index + 1}</TableCell> */}
                        <TableCell className="font-medium text-center">{surah.namaLatin}</TableCell>
                        <TableCell className="text-center hidden md:table-cell">{surah.totalAyat}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Progress value={progressValue} className="w-[60%]" indicatorClassName={getProgressColorClass(progressValue)} />
                            <span>{surah.progress}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    )})
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                        Tidak ada surah yang cocok dengan pencarian.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </OrtuLayout>
  );
}