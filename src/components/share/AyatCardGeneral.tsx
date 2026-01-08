import { Card } from "@/components/ui/card";
import { toArabicNumber } from "@/utils/formatArabNumber";

interface AyatCardProps {
  ayat: {
    id: number;
    nomor: number;
    ar: string;
    tr: string;
    idn: string;
  };
}

export function AyatCardGeneral({ ayat }: AyatCardProps) {
  return (
    <Card key={ayat.id} id={`ayat-${ayat.nomor}`} className="p-4 border border-violet-600/90">
      <p
        className="text-right md:text-3xl text-2xl leading-14 md:leading-20 my-3 font-arabic"
        dir="rtl"
      >
        {ayat.ar} 
        <span className="mr-2 text-md font-arabic">
          ۝{toArabicNumber(ayat.nomor)}
        </span> 
      </p>

      <p className="text-left text-base text-green-600 italic">
        {ayat.tr}
      </p>

      <p className="text-left text-base text-gray-800">
        {ayat.idn}
      </p>
    </Card>
  );
}
