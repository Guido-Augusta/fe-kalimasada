import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import OrtuProfileCard from "@/components/share/OrtuProfileCard";
import { useOrtuDetail } from "@/features/admin/hooks/useOrtuData";
import SantriLayout from "../components/SantriLayout";

export default function SantriDetailOrtu() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: ortuData, isLoading: isLoadingOrtu, isError: isErrorOrtu, error: _ortuError } = useOrtuDetail(id as string);

  return (
    <SantriLayout>
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          {/* <Link to="/santri"> */}
            <Button variant="outline" size="sm" className="flex items-center gap-2 bg-yellow-500 text-white hover:bg-yellow-600 hover:text-white" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Kembali</span>
            </Button>
          {/* </Link> */}
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Detail Orang Tua</h1>
        </div>

          {isLoadingOrtu ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="ml-2">Memuat...</p>
            </div>
          ) : isErrorOrtu ? (
            <div className="flex justify-center items-center h-full text-red-500">
              {/* <p>Error: {ortuError?.message}</p> */}
              <p>Gagal memuat data detail ortu.</p>
            </div>
          ) : !ortuData ? (
            <div className="flex justify-center items-center h-full text-muted-foreground">
              <p>Data orang tua tidak ditemukan.</p>
            </div>
          ) : (
            <OrtuProfileCard
              ortuData={ortuData}
            />
          )}
      </div>
    </SantriLayout>
  );
}