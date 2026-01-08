import RiwayatDetailContent from "@/components/share/RiwayatDetailContent";
import UstadzLayout from "../components/UstadzLayout";
import { useParams, useSearchParams } from "react-router-dom";

export default function UstadzDetailHafalan() {
  const { santriId, surahId } = useParams<{ santriId: string; surahId: string }>();
  const [searchParams] = useSearchParams();
  const tanggal = searchParams.get("tanggal");
  const status = searchParams.get("status");

  if (!santriId || !surahId || !tanggal || !status) {
    return (
      <UstadzLayout>
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
          {/* <p className="text-center text-red-500">Parameter tidak lengkap.</p> */}
          <p className="text-center text-red-500">Error: Tidak dapat menemukan data riwayat hafalan.</p>
        </div>
      </UstadzLayout>
    );
  }

  return (
    <UstadzLayout>
      <RiwayatDetailContent
        santriId={santriId}
        surahId={surahId}
        tanggal={tanggal}
        status={status}
        backLink={`/ustadz/riwayat/hafalan/${santriId}`}
      />
    </UstadzLayout>
  );
}