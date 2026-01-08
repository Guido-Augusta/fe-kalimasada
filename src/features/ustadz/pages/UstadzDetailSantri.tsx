import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import SantriProfileCard from "@/components/share/SantriProfileCard";
import { useSantriDetail } from "@/features/admin/hooks/useSantriData";
import UstadzLayout from "../components/UstadzLayout";
import { useState } from "react";
import UpdateHafalanDialog from "@/components/share/UpdateHafalanDialog";

export default function UstadzDetailSantri() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();  
  const { data: santriData, isLoading: isSantriLoading, isError: isSantriError, error: _santriError } = useSantriDetail(id as string);
  const [isHafalanDialogOpen, setIsHafalanDialogOpen] = useState(false);

  return (
    <UstadzLayout>
      <div className="flex items-center gap-4 mb-6">
        {/* <Link to="/ustadz"> */}
          <Button variant="outline" size="sm" className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white hover:text-white" onClick={() => navigate(-1)}>
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
          <p>Gagal memuat data santri.</p>
        </div>
      ) : !santriData ? (
        <div className="flex justify-center items-center text-muted-foreground">
          <p>Data santri tidak ditemukan.</p>
        </div>
      ) : (
        <>
          <SantriProfileCard
            santriData={santriData}
            baseUrl="/ustadz"
            role="ustadz"
            onUpdateHafalanClick={() => setIsHafalanDialogOpen(true)}
          />
          <UpdateHafalanDialog
            santriData={santriData}
            isOpen={isHafalanDialogOpen}
            onClose={() => setIsHafalanDialogOpen(false)}
          />
        </>
      )}
    </UstadzLayout>
  );
}