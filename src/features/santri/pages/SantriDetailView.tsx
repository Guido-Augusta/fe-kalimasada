import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import SantriProfileCard from "@/components/share/SantriProfileCard";
import { useSantriDetail } from "@/features/admin/hooks/useSantriData";
import SantriLayout from "../components/SantriLayout";

export default function SantriDetailView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: santriData, isLoading: isSantriLoading, isError: isSantriError, error: _santriError } = useSantriDetail(id as string);

  return (
    <SantriLayout>
      <div className="flex items-center gap-4 mb-6">
        {/* <Link to="/santri/peringkat"> */}
        <Button variant="outline" size="sm" className="flex items-center gap-2 bg-yellow-500 text-white hover:bg-yellow-600 hover:text-white" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Kembali</span>
        </Button>
        {/* </Link> */}
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Detail Santri</h1>
      </div>

      { isSantriLoading ? (
        <div className="flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="ml-2">Memuat...</p>
        </div>
      ) : isSantriError ? (
        <div className="flex justify-center items-center text-red-500">
          {/* <p>Error: {santriError?.message}</p> */}
          <p>Gagal memuat data detail santri.</p>
        </div>
      ) : !santriData ? (
        <div className="flex justify-center items-center text-muted-foreground">
          <p>Data santri tidak ditemukan.</p>
        </div>
      ) : (
        <SantriProfileCard santriData={santriData} baseUrl="/santri" />
      )}
    </SantriLayout>
  );
}