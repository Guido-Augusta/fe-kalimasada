import { useParams, useNavigate } from "react-router-dom";
import UstadzLayout from "../components/UstadzLayout";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchRiwayatHafalan } from "../service/hafalan.service";
import type { RiwayatHafalanResponse } from "../types/hafalan.type";
import RiwayatTable from "@/components/share/RiwayatTable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSantriRiwayatStore } from "@/store/useSantriRiwayatStore";

export default function UstadRiwayatHafalan() {
  const { idSantri } = useParams<{ idSantri: string }>();
  const navigate = useNavigate();
  const { statusFilter, setStatusFilter, currentPage, setCurrentPage } = useSantriRiwayatStore();

  const { data, isLoading, isError, error: _error, isFetching } = useQuery<RiwayatHafalanResponse>({
    queryKey: ["riwayatHafalan", idSantri, currentPage, statusFilter],
    queryFn: () => fetchRiwayatHafalan(idSantri as string, currentPage, statusFilter),
    enabled: !!idSantri,
  });

  const riwayatList = data?.data || [];
  const santri = data?.santri;
  const totalPages = data?.pagination?.totalPages || 1;

  return (
    <UstadzLayout>
      <div className="container mx-auto md:p-6 lg:p-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white hover:text-white" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Kembali</span>
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Riwayat Hafalan : {santri?.nama}
          </h1>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <div className="flex md:justify-between justify-start flex-col md:flex-row md:items-center">
              <div className="mb-2 md:mb-0">
                <CardTitle>Riwayat Hafalan</CardTitle>
                <CardDescription>
                  Daftar catatan hafalan dan murajaah santri.
                </CardDescription>
              </div>
              <Select onValueChange={(value: "TambahHafalan" | "Murajaah") => {
                setStatusFilter(value);
                setCurrentPage(1);
              }} value={statusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Pilih Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TambahHafalan">Tambah Hafalan</SelectItem>
                  <SelectItem value="Murajaah">Murajaah</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center items-center">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="ml-2">Memuat data riwayat hafalan...</p>
              </div>
            ) : isError ? (
              <div className="flex justify-center items-center text-red-500">
                {/* <p>Error: {(error as Error)?.message}</p> */}
                <p>Gagal memuat data riwayat hafalan.</p>
              </div>
            ) : !santri ? (
              <div className="flex justify-center items-center text-muted-foreground">
                <p>Data riwayat hafalan tidak ditemukan.</p>
              </div>
            ) : (
              <RiwayatTable
                riwayatList={riwayatList}
                totalPages={totalPages}
                currentPage={currentPage}
                isFetching={isFetching}
                onPageChange={setCurrentPage}
                idSantri={idSantri as string}
                showDeleteButton={true}
                statusFilter={statusFilter}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </UstadzLayout>
  );
}