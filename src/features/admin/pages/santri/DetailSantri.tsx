import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import { useSantriDetail } from "../../hooks/useSantriData";
import SantriProfileCard from "@/components/share/SantriProfileCard";

export default function AdminDetailSantri() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: santriData, isLoading: isSantriLoading, isError: isSantriError, error: _santriError } = useSantriDetail(id as string);

  return (
    <AdminLayout>
      <div className="container mx-auto md:p-4 p-0 max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 hover:text-white text-white" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Kembali</span>
          </Button>
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
            <p className="text-wrap">Gagal memuat data detail santri.</p>
          </div>
        ) : !santriData ? (
          <div className="flex justify-center items-center text-muted-foreground">
            <p>Data santri tidak ditemukan.</p>
          </div>
        ) : (
          <SantriProfileCard santriData={santriData} baseUrl="/admin" role="admin" />
        )}
      </div>
    </AdminLayout>
  );
}