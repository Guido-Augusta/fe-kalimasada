import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Ayat, SurahInfo } from "../types/santri.type";
import { toArabicNumber } from "@/utils/formatArabNumber";

interface AyatCardProps {
  ayat: Ayat;
  surah: SurahInfo;
}

export function AyatCard({ ayat }: AyatCardProps) {
  return (
    <Card key={ayat.id} id={`ayat-${ayat.id}`} className="p-4 border border-violet-600/90">
      <div className="flex justify-between items-center ml-auto">
        {ayat.checked ? (
          <Badge variant="default" className="bg-green-500">
            Hafal
          </Badge>
        ) : (
          <Badge variant="default" className="bg-red-500">
            Belum Hafal
          </Badge>
        )}
      </div>
      <p
        className="text-right md:text-3xl text-2xl leading-14 md:leading-20 font-arabic"
        dir="rtl"
      >
        {ayat.arab} 
        <span className="mr-2 text-md font-arabic">
          ۝{toArabicNumber(ayat.nomorAyat)}
        </span> 
      </p>

      <p className="text-left text-base text-green-600 italic">
        {ayat.latin}
      </p>

      <p className="text-left text-base text-gray-800">
        {ayat.terjemah}
      </p>
    </Card>
  );
}