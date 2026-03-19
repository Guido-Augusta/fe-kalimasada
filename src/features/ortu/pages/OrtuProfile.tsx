import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import OrtuProfileCard from "@/components/share/OrtuProfileCard";
import useUser from "@/store/useUser";
import { useOrtuDetail } from "@/features/admin/hooks/useOrtuData";
import OrtuLayout from "../components/OrtuLayout";
import { useNavigate } from "react-router-dom";

export default function OrtuProfile() {
  const { user } = useUser()
  const navigate = useNavigate();
  const { data, isLoading, isError, error: _error } = useOrtuDetail(user?.roleId as string);

  return (
    <OrtuLayout>
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          {/* <Link to="/ortu"> */}
            <Button variant="outline" size="sm" className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 hover:text-white text-white" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" onClick={() => navigate(-1)} />
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
            <p>Gagal memuat data detail ortu.</p>
          </div>
        ) : !data ? (
          <div className="flex justify-center items-center text-muted-foreground">
            <p>Data orang tua tidak ditemukan.</p>
          </div>
        ) : (
          <OrtuProfileCard
            ortuData={data}
            role="ortu"
          />
        )}
      </div>
    </OrtuLayout>
  );
}