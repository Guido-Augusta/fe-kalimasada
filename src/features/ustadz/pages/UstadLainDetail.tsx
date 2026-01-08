import { useNavigate, useParams } from "react-router-dom";
import UstadProfileCard from "@/components/share/UstadProfileCard";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import UstadzLayout from "../components/UstadzLayout";
import { useUstadzDetail } from "@/features/admin/hooks/useUstadzData";

export default function UstadLainDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError, error: _error } = useUstadzDetail(id as string);

  return (
    <UstadzLayout>
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" className="text-white flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 hover:text-white" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Kembali</span>
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Detail Ustadz</h1>
        </div>

        { isLoading ? (
          <div className="flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="ml-2">Memuat...</p>
          </div>
        ) : isError ? (
          <div className="flex justify-center items-center text-red-500">
            {/* <p>Error: {error?.message || "Gagal memuat data ustadz."}</p> */}
            <p>Gagal memuat data ustadz.</p>
          </div>
        ) : !data ? (
          <div className="flex justify-center items-center text-muted-foreground">
            <p>Data ustadz tidak ditemukan.</p>
          </div>
        ) : (
          <UstadProfileCard ustadData={data} baseUrl="/ustadz" role="ustadz" />
        )}
      </div>
    </UstadzLayout>
  );
}