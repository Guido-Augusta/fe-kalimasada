import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import { useOrtuDetail } from "../../hooks/useOrtuData";
import SantriTable from "../../components/SantriTable";
import { useSantriList } from "../../hooks/useSantriData";
import OrtuProfileCard from "@/components/share/OrtuProfileCard";

export default function OrtuDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError, error: _error } = useOrtuDetail(id as string);
  const currentPage = 1
  const itemsPerPage = 10;
  const searchFilter = "";
  const ortuId = data?.id ? String(data.id) : null;

  const { data: dataSantri, isLoading: isLoadingSantri, isError: isErrorSantri } = useSantriList(
    currentPage,
    itemsPerPage,
    searchFilter,
    // { ortuId: String(data?.id) }
    { ortuId: ortuId as string }
  );

  return (
    <AdminLayout>
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="sm" className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 hover:text-white text-white" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Kembali</span>
            </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Detail Orang Tua</h1>
        </div>

        { isLoading ? (
          <div className="flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="ml-2">Memuat...</p>
          </div>
        ) : isError ? (
          <div className="flex justify-center items-center text-red-500">
            {/* <p>Error: {error?.message}</p> */}
            <p>Gagal memuat data detail orang tua.</p>
          </div>
        ) : !data ? (
          <div className="flex justify-center items-center text-muted-foreground">
            <p>Data orang tua tidak ditemukan.</p>
          </div>
        ) : (
          <>
          <OrtuProfileCard
            ortuData={data}
            />
          <h1 className="text-lg sm:text-xl font-bold text-foreground md:mt-0 mt-4">Daftar Anak</h1>
          <SantriTable
            santriList={dataSantri?.data || []}
            isLoading={isLoadingSantri}
            isError={isErrorSantri}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            />
          </>
        )}

      </div>
    </AdminLayout>
  );
}