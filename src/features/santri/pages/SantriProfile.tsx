import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import SantriProfileCard from "@/components/share/SantriProfileCard";
import SantriLayout from "../components/SantriLayout";
import { useSantriDetail } from "@/features/admin/hooks/useSantriData";
import useUser from "@/store/useUser";
import { useNavigate } from "react-router-dom";

export default function SantriProfile() {
  const { user } = useUser();
  const navigate = useNavigate();
  
  const { data: santriData, isLoading: isSantriLoading, isError: isSantriError, error: _santriError } = useSantriDetail(user?.roleId as string);

  return (
    <SantriLayout>
      <div className="flex items-center gap-4 mb-6">
        {/* <Link to="/santri"> */}
          <Button variant="outline" size="sm" className="flex items-center gap-2 bg-yellow-500 text-white hover:bg-yellow-600 hover:text-white" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Kembali</span>
          </Button>
        {/* </Link> */}
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Profil</h1>
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
          <p>Data Profil tidak ditemukan.</p>
        </div>
      ) : (
        <SantriProfileCard santriData={santriData} baseUrl="/santri" role={"santri"} />
      )}
    </SantriLayout>
  );
}