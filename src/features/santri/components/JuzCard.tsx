import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import type { Juz } from "../types/santri.type";

interface JuzCardProps {
  juz: Juz;
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

export function JuzCard({ juz }: JuzCardProps) {
  return (
    <Link to={`/santri/baca/juz/${juz.juz}`}>
      <Card className="group cursor-pointer rounded-2xl bg-violet-600/90 text-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <Badge
            variant="outline"
            className="rounded-full w-10 h-10 flex items-center justify-center font-semibold text-white"
          >
            {juz.juz}
          </Badge>
      
          <Badge className={getBadgeVariant(juz.progress)}>
            {getBadgeText(juz.progress)}
          </Badge>
        </CardHeader>
      
        <CardContent>
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center justify-between">
              <h3 className="font-semibold text-lg">
                Juz {juz.juz}
              </h3>
              {juz.mulai_dari && (
                <span className="text-sm opacity-80">
                  {juz.mulai_dari.surah.nama}
                </span>
              )}
            </div>
      
            <div className="flex justify-between items-center gap-2">
              <p className="text-sm italic">Progres: {juz.progress}</p>
              <div className="text-sm italic">{juz.totalAyat} Ayat</div>
            </div>

            {juz.mulai_dari && (
              <p className="text-xs opacity-70">
                Mulai: {juz.mulai_dari.surah.nama_latin} Ayat {juz.mulai_dari.ayat}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
