import RiwayatJuzDetailContent from "@/components/share/RiwayatJuzDetailContent";
import OrtuLayout from "../components/OrtuLayout";
import { useParams, useSearchParams } from "react-router-dom";

export default function OrtuDetailHafalanJuz() {
  const { santriId, juzId } = useParams<{ santriId: string; juzId: string }>();
  const [searchParams] = useSearchParams();
  const tanggal = searchParams.get("tanggal");
  const status = searchParams.get("status");

  if (!santriId || !juzId || !tanggal || !status) {
    return (
      <OrtuLayout>
        <div className="container mx-auto">
          <p className="text-center text-red-500">Error: Tidak dapat menemukan data riwayat hafalan.</p>
        </div>
      </OrtuLayout>
    );
  }

  return (
    <OrtuLayout>
      <RiwayatJuzDetailContent
        santriId={santriId}
        juzId={juzId}
        tanggal={tanggal}
        status={status}
        backLink={`/ortu/riwayat/hafalan/${santriId}`}
      />
    </OrtuLayout>
  );
}
