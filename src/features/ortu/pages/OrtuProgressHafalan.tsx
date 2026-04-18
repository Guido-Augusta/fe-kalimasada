import { useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Search, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatTahapHafalan } from "@/utils/tahapHafalan";
import OrtuLayout from "../components/OrtuLayout";
import { useHafalanProgressData } from "@/features/ustadz/hooks/useHafalanData";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function OrtuProgressHafalan() {
  const { idSantri } = useParams<{ idSantri: string }>();
  const [mode, setMode] = useState<"surah" | "juz">("surah");
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, isError } = useHafalanProgressData(idSantri as string, mode);
  const navigate = useNavigate();

  const santri = data?.santri;
  const progressList = data?.data || [];

  const filteredProgress = progressList?.filter((item) => {
    if (mode === "surah") {
      const surah = item as { namaLatin?: string };
      return surah.namaLatin?.toLowerCase().includes(searchTerm.toLowerCase());
    } else {
      const juz = item as { juz?: number };
      return juz.juz?.toString().includes(searchTerm);
    }
  });

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
      <div className="container mx-auto">
        <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="sm" className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 hover:text-white text-white" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Kembali</span>
            </Button>
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
                <CardTitle>{mode === "surah" ? "Daftar Surat" : "Daftar Juz"}</CardTitle>
                <CardDescription>{mode === "surah" ? "Progres hafalan surat-surat Al-Qur'an." : "Progres hafalan juz-juz Al-Qur'an."}</CardDescription>
              </div>
              <div className="flex items-center gap-2 md:mt-0 mt-2">
                <Select
                  value={mode}
                  onValueChange={(value: "surah" | "juz") => {
                    setMode(value);
                    setSearchTerm("");
                  }}
                >
                  <SelectTrigger className="w-[140px] bg-white">
                    <SelectValue placeholder="Pilih mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="surah">Surah</SelectItem>
                    <SelectItem value="juz">Juz</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative flex-grow max-w-sm bg-white">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder={mode === "surah" ? "Cari nama surah..." : "Cari juz (misal: 1, 2)..."}
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
                    <TableHead className="w-16 text-center">No</TableHead>
                    {mode === "surah" ? (
                      <>
                        <TableHead className="w-[100px] text-center">Nama Surah</TableHead>
                        <TableHead className="text-center hidden md:table-cell">Jumlah Ayat</TableHead>
                      </>
                    ) : (
                      <>
                        <TableHead className="w-[100px] text-center">Juz</TableHead>
                        <TableHead className="text-center hidden md:table-cell">Jumlah Ayat</TableHead>
                      </>
                    )}
                    <TableHead className="text-center">Status Hafalan</TableHead>
                    <TableHead className="text-center">Detail</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProgress?.length > 0 ? (
                    filteredProgress.map((item, index) => {
                      if (mode === "surah") {
                        const surah = item as { id: number; namaLatin: string; totalAyat: number; progress: string };
                        const [current, total] = surah.progress.split("/").map(Number);
                        const progressValue = total > 0 ? (current / total) * 100 : 0;
                        return (
                          <TableRow key={surah.id}>
                            <TableCell className="text-center font-medium">{index + 1}</TableCell>
                            <TableCell className="font-medium text-center">{surah.namaLatin}</TableCell>
                            <TableCell className="text-center hidden md:table-cell">{surah.totalAyat}</TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-2">
                                <Progress value={progressValue} className="w-[60%]" indicatorClassName={getProgressColorClass(progressValue)} />
                                <span>{surah.progress}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <Link to={`/ortu/hafalan/${santri?.id}/${surah.id}`}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-green-500 hover:bg-green-600 text-white hover:text-white"
                                >
                                  <ChevronRight className="h-4 w-4" />
                                  <span className="hidden md:inline">Detail</span>
                                </Button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        );
                      } else {
                        const juz = item as { id: number; juz: number; totalAyat: number; progress: string };
                        const [current, total] = juz.progress.split("/").map(Number);
                        const progressValue = total > 0 ? (current / total) * 100 : 0;
                        return (
                          <TableRow key={juz.id}>
                            <TableCell className="text-center font-medium">{index + 1}</TableCell>
                            <TableCell className="font-medium text-center">Juz {juz.juz}</TableCell>
                            <TableCell className="text-center hidden md:table-cell">{juz.totalAyat}</TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-2">
                                <Progress value={progressValue} className="w-[60%]" indicatorClassName={getProgressColorClass(progressValue)} />
                                <span>{juz.progress}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <Link to={`/ortu/hafalan/${santri?.id}/juz/${juz.juz}`}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-green-500 hover:bg-green-600 text-white hover:text-white"
                                >
                                  <ChevronRight className="h-4 w-4" />
                                  <span className="hidden md:inline">Detail</span>
                                </Button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        );
                      }
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        {mode === "surah" ? "Tidak ada surah yang cocok dengan pencarian." : "Tidak ada juz yang cocok dengan pencarian."}
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