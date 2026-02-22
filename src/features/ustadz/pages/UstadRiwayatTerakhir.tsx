import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import UstadzLayout from "../components/UstadzLayout";
import { useRiwayatTerakhir } from "../hooks/useHafalanData";
import { useRiwayatTerakhirStore } from "@/store/useRiwayatTerakhirStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import RiwayatTerakhirTable from "../components/RiwayatTerakhirTable";
import { Search } from "lucide-react";
import { sortAyatOptions } from "../constant/sortOptions";

export default function UstadRiwayatTerakhir() {
  const { currentPage, setCurrentPage, searchName, selectedTahap, statusFilter, sortByAyat, mode, setState } = useRiwayatTerakhirStore();
  const initialSortValue = sortByAyat || "none"; 
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(initialSortValue)
  const [localSearchName, setLocalSearchName] = useState(searchName);

  const filters: {
    tahapHafalan: string;
    name: string;
    sortByAyat?: "asc" | "desc";
    mode?: "surah" | "juz";
  } = {
    tahapHafalan: selectedTahap,
    name: searchName,
    mode: mode,
  };

  if (sortByAyat && (sortByAyat === "asc" || sortByAyat === "desc")) {
    filters.sortByAyat = sortByAyat;
  }

  const { data, isLoading, isError, error: _error, isFetching } = useRiwayatTerakhir(currentPage, 10, statusFilter, filters);

  const dataList = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;

  const handleTahapChange = (value: string) => {
    setState({ selectedTahap: value, currentPage: 1 });
  };

  const onPageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearchNameChange = (value: string) => {
    // setState({ searchName: value, currentPage: 1 });
    setLocalSearchName(value);

    if (value === "") {
      setState({ searchName: "", currentPage: 1 });
    }
  };

  const handleSearchNameSubmit = () => {
    // setState({ searchName, currentPage: 1 });
    setState({ searchName: localSearchName, currentPage: 1 });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchNameSubmit();
    }
  };

  const isPreviousButtonDisabled = currentPage === 1 || isFetching;
  const isNextButtonDisabled = currentPage === totalPages || isFetching;

  const handleSortAyatChange = (currentValue: string) => {
    setValue(currentValue);

    let newSortByAyat: "asc" | "desc" | null = null;
    if (currentValue === "asc" || currentValue === "desc") {
        newSortByAyat = currentValue;
    } 

    setState({ sortByAyat: newSortByAyat, currentPage: 1 });
    setOpen(false);
  }

  return (
    <UstadzLayout>
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-violet-600/90">Riwayat Hafalan Terakhir Santri</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-violet-600/90">Daftar Riwayat Hafalan Terakhir</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex items-center gap-2 flex-1 max-w-sm">
              <Input
                placeholder="Cari nama santri..."
                className="pr-10"
                // value={searchName}
                value={localSearchName}
                onChange={(e) => handleSearchNameChange(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button 
                onClick={handleSearchNameSubmit}
                className="flex-shrink-0 bg-yellow-500 hover:bg-yellow-600 text-white hover:text-white"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-2">
              <Select onValueChange={(value: "TambahHafalan" | "Murajaah") => {
                  setState({ statusFilter: value, currentPage: 1 });
              }} value={statusFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Pilih Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TambahHafalan">Hafalan</SelectItem>
                  <SelectItem value="Murajaah">Murajaah</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(value: "surah" | "juz") => {
                  setState({ mode: value, currentPage: 1 });
              }} value={mode}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="surah">Ayat</SelectItem>
                  <SelectItem value="juz">Halaman</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={handleTahapChange} value={selectedTahap}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tahap Hafalan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Level1">Level 1 - Juz 30</SelectItem>
                  <SelectItem value="Level2">Level 2 - Surat Wajib</SelectItem>
                  <SelectItem value="Level3">Level 3 - Juz 1-29</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <RiwayatTerakhirTable
            dataList={dataList}
            statusFilter={statusFilter}
            mode={mode}
            open={open}
            setOpen={setOpen}
            value={value}
            sortAyat={sortAyatOptions}
            handleSortAyatChange={handleSortAyatChange}
            searchName={searchName}
            isFetching={isFetching}
            isLoading={isLoading}
            isError={isError}
          />

          {totalPages > 1 && (
            <div className="mt-4 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onPageChange(currentPage - 1);
                      }}
                      className={`${isPreviousButtonDisabled ? "pointer-events-none opacity-50" : ""}`}
                    />
                  </PaginationItem>
                    
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                    const isFirstPage = page === 1;
                    const isLastPage = page === totalPages;
                    const isCurrentPage = page === currentPage;
                    const isNearbyPage = page === currentPage - 1 || page === currentPage + 1;

                    if (isFirstPage || isLastPage || isCurrentPage || isNearbyPage) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              onPageChange(page);
                              }}
                              isActive={isCurrentPage}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                    } else if (page === 2 && currentPage > 3) {
                      return (
                        <PaginationItem key="start-ellipsis">
                          <span className="px-2">...</span>
                        </PaginationItem>
                      );
                    } else if (page === totalPages - 1 && currentPage < totalPages - 2) {
                      return (
                        <PaginationItem key="end-ellipsis">
                          <span className="px-2">...</span>
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}
                    
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onPageChange(currentPage + 1);
                      }}
                      className={`${isNextButtonDisabled ? "pointer-events-none opacity-50" : ""}`}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </UstadzLayout>
  );
}