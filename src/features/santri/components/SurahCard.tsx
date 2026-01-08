import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import type { Surah } from "../types/santri.type";

interface SurahCardProps {
  surah: Surah;
}

const getBadgeVariant = (progress: string) => {
  const [halaman, total] = progress.split("/").map(Number);
  if (halaman === total) return "bg-green-500";
  if (halaman > 0) return "bg-yellow-500";
  return "bg-red-500";
};

const getBadgeText = (progress: string) => {
  const [halaman, total] = progress.split("/").map(Number);
  if (halaman === total) return "Hafal";
  if (halaman > 0) return "Proses";
  return "Belum Mulai";
};

export function SurahCard({ surah }: SurahCardProps) {
  return (
    <Link to={`/santri/baca/surah/${surah.id}`}>
      <Card className="group cursor-pointer rounded-2xl bg-violet-600/90 text-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <Badge
            variant="outline"
            className="rounded-full w-10 h-10 flex items-center justify-center font-semibold text-white"
          >
            {surah.nomor}
          </Badge>
      
          <Badge className={getBadgeVariant(surah.progress)}>
            {getBadgeText(surah.progress)}
          </Badge>
        </CardHeader>
      
        <CardContent>
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center justify-between">
              <h3 className="font-semibold text-lg">
                {surah.namaLatin}
              </h3>
              <span className="text-xl font-arabic">{surah.nama}</span>
            </div>
      
            <div className="flex justify-between items-center gap-2">
              <p className="text-sm italic">Progres: {surah.progress}</p>
              <div className="text-sm italic">{surah.totalAyat}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}