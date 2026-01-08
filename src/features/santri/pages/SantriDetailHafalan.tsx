import RiwayatDetailContent from "@/components/share/RiwayatDetailContent";
import SantriLayout from "../components/SantriLayout";
import { useParams, useSearchParams } from "react-router-dom";
import useUser from "@/store/useUser";

export default function SantriDetailHafalan() {
  const { user } = useUser()
  const { surahId } = useParams<{ surahId: string }>();
  const [searchParams] = useSearchParams();
  const tanggal = searchParams.get("tanggal");
  const status = searchParams.get("status");

  const mySantriId = user?.roleId;

  if (!surahId || !tanggal || !status) {
    return (
      <SantriLayout>
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
          {/* <p className="text-center text-red-500">Parameter tidak lengkap.</p> */}
          <p className="text-center text-red-500">Error: Tidak dapat menemukan data riwayat hafalan.</p>
        </div>
      </SantriLayout>
    );
  }

  return (
    <SantriLayout>
      <RiwayatDetailContent
        santriId={mySantriId as string}
        surahId={surahId}
        tanggal={tanggal}
        status={status}
        backLink={`/santri/riwayat/hafalan`}
      />
    </SantriLayout>
  );
}