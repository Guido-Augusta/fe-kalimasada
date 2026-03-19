import RiwayatJuzDetailContent from "@/components/share/RiwayatJuzDetailContent";
import UstadzLayout from "../components/UstadzLayout";
import { useParams, useSearchParams } from "react-router-dom";

export default function UstadzDetailHafalanJuz() {
  const { santriId, juzId } = useParams<{ santriId: string; juzId: string }>();
  const [searchParams] = useSearchParams();
  const tanggal = searchParams.get("tanggal");
  const status = searchParams.get("status");

  if (!santriId || !juzId || !tanggal || !status) {
    return (
      <UstadzLayout>
        <div className="container mx-auto">
          <p className="text-center text-red-500">Error: Tidak dapat menemukan data riwayat hafalan.</p>
        </div>
      </UstadzLayout>
    );
  }

  return (
    <UstadzLayout>
      <RiwayatJuzDetailContent
        santriId={santriId}
        juzId={juzId}
        tanggal={tanggal}
        status={status}
        backLink={`/ustadz/riwayat/hafalan/${santriId}`}
      />
    </UstadzLayout>
  );
}
