import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import type { SurahGeneral } from "@/hooks/useAlquran";

interface SurahCardGeneralProps {
  surah: SurahGeneral;
  role: string;
}

export function SurahCardGeneral({ surah, role }: SurahCardGeneralProps) {
  return (
    <Link to={`/${role}/alquran/${surah.id}`}>
      <Card className="group cursor-pointer rounded-2xl bg-violet-600/90 text-white">
        <CardHeader className="flex flex-row items-center justify-between">
          {/* Nomor Surah */}
          <Badge
            variant="outline"
            className="rounded-full w-10 h-10 flex items-center justify-center font-semibold text-white"
          >
            {surah.nomor}
          </Badge>

          {/* Tempat Turun */}
          <span className="text-xs capitalize">
            {surah.tempatTurun}
          </span>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-2">
            {/* Nama Latin + Ayat */}
            <div className="flex flex-row items-center justify-between">
              <h3 className="font-semibold text-lg">
                {surah.namaLatin}
              </h3>
              <span className="text-xl font-arabic">
              {surah.nama}
              </span>
            </div>

            <div className="flex justify-between items-center gap-2">
              {/* Arti Surah */}
              <p className="text-sm italic">
                “{surah.arti}”
              </p>

              {/* Nama Arab */}
              <div className="text-sm italic">
                {surah.totalAyat}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
