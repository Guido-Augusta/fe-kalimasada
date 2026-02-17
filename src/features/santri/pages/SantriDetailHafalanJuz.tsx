import RiwayatJuzDetailContent from "@/components/share/RiwayatJuzDetailContent";
import SantriLayout from "../components/SantriLayout";
import { useParams, useSearchParams } from "react-router-dom";
import useUser from "@/store/useUser";

export default function SantriDetailHafalanJuz() {
  const { user } = useUser()
  const { juzId } = useParams<{ juzId: string }>();
  const [searchParams] = useSearchParams();
  const tanggal = searchParams.get("tanggal");
  const status = searchParams.get("status");

  const mySantriId = user?.roleId;

  if (!juzId || !tanggal || !status) {
    return (
      <SantriLayout>
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
          <p className="text-center text-red-500">Error: Tidak dapat menemukan data riwayat hafalan.</p>
        </div>
      </SantriLayout>
    );
  }

  return (
    <SantriLayout>
      <RiwayatJuzDetailContent
        santriId={mySantriId as string}
        juzId={juzId}
        tanggal={tanggal}
        status={status}
        backLink={`/santri/riwayat/hafalan`}
      />
    </SantriLayout>
  );
}
