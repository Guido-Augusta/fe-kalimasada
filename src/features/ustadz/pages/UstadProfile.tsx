import UstadProfileCard from "@/components/share/UstadProfileCard";
import { ArrowLeft, Loader2 } from "lucide-react";
import UstadzLayout from "../components/UstadzLayout";
import useUser from "@/store/useUser";
import { useUstadzDetail } from "@/features/admin/hooks/useUstadzData";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function UstadProfile() {
  const { user } = useUser()
  const navigate = useNavigate()
  const { data, isLoading, isError, error: _error } = useUstadzDetail(user?.roleId as string);

  return (
    <UstadzLayout>
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          {/* <Link to={"/ustadz"}> */}
            <Button variant="outline" size="sm" className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white hover:text-white" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Kembali</span>
            </Button>
          {/* </Link> */}
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Profil</h1>
        </div>

        { isLoading ? (
          <div className="flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="ml-2">Memuat...</p>
          </div>
        ) : isError ? (
          <div className="flex justify-center items-center text-red-500">
            {/* <p>Error: {error?.message}</p> */}
            <p>Gagal memuat data detail ustadz.</p>
          </div>
        ) : !data ? (
          <div className="flex justify-center items-center text-muted-foreground">
            <p>Data ustadz tidak ditemukan.</p>
          </div>
        ) : (
          <UstadProfileCard ustadData={data} baseUrl="/ustadz" role={"ustadz"} />
        )}
      </div>
    </UstadzLayout>
  );
}