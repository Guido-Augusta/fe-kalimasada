import RiwayatDetailContent from "@/components/share/RiwayatDetailContent";
import OrtuLayout from "../components/OrtuLayout";
import { useParams, useSearchParams } from "react-router-dom";

export default function OrtuDetailHafalan() {
  const { santriId, surahId } = useParams<{ santriId: string; surahId: string }>();
  const [searchParams] = useSearchParams();
  const tanggal = searchParams.get("tanggal");
  const status = searchParams.get("status");

  if (!santriId || !surahId || !tanggal || !status) {
    return (
      <OrtuLayout>
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
          {/* <p className="text-center text-red-500">Parameter tidak lengkap.</p> */}
          <p className="text-center text-red-500">Error: Tidak dapat menemukan data riwayat hafalan.</p>
        </div>
      </OrtuLayout>
    );
  }

  return (
    <OrtuLayout>
      <RiwayatDetailContent
        santriId={santriId}
        surahId={surahId}
        tanggal={tanggal}
        status={status}
        backLink={`/ortu/riwayat/hafalan/${santriId}`}
      />
    </OrtuLayout>
  );
}