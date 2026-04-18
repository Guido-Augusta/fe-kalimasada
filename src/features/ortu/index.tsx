import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, } from "@/components/ui/pagination";
import { Search, Loader2, Eye, Book, Notebook } from "lucide-react";
import { Link } from "react-router-dom";
import { useSantriList } from "../admin/hooks/useSantriData";
import OrtuLayout from "./components/OrtuLayout";
import useUser from "@/store/useUser";
import { formatTahapHafalan } from "@/utils/tahapHafalan";

const OrtuDashboard = () => {
  const { user } = useUser()
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data, isLoading, isError, isFetching } = useSantriList(
    currentPage,
    itemsPerPage,
    searchFilter,
    { ortuId: String(user?.roleId) }
  );

  const santriList = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);

    if (value.trim() === "") {
      setSearchFilter("");
      setCurrentPage(1);
    }
  };

  const handleSearchSubmit = () => {
    setSearchFilter(searchQuery);
    setCurrentPage(1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };
  
  const isPreviousButtonDisabled = currentPage === 1 || isFetching;
  const isNextButtonDisabled = currentPage === totalPages || isFetching;

  return (
    <OrtuLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-violet-600/90">Daftar Anak</h2>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-violet-600/90">Daftar Anak</CardTitle>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative flex items-center gap-2 flex-1 max-w-sm">
                <Input
                  placeholder="Cari nama anak..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pr-10"
                />
                <Button onClick={handleSearchSubmit} className="flex-shrink-0 bg-yellow-500 hover:bg-yellow-600 text-white hover:text-white">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-x-auto">
              <div className="md:min-w-[640px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">No</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead className="hidden md:table-cell">Tahapan</TableHead>
                      <TableHead className="text-center">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">
                          <p className="flex items-center gap-2 md:justify-center">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Memuat...
                          </p>
                        </TableCell>
                      </TableRow>
                    ) : isError ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center text-red-500"
                        >
                          {/* Error: {error?.message} */}
                          <p className="text-wrap">Gagal memuat data anak. Coba lagi.</p>
                        </TableCell>
                      </TableRow>
                    ) : santriList.length > 0 ? (
                      santriList.map((santri, _index) => (
                        <TableRow key={santri.id}>
                          <TableCell className="font-medium text-center">
                            {(currentPage - 1) * itemsPerPage + _index + 1}
                          </TableCell>
                          <TableCell className="font-medium">
                            {santri.nama.length > 15 ? santri.nama.substring(0, 10) + "..." : santri.nama}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant="secondary">
                              {formatTahapHafalan(santri.tahapHafalan)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex gap-2 justify-center">
                              <Link to={`/ortu/santri-detail/${santri.id}`}>
                                <Button size="sm" variant="outline" className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white">
                                  <Eye className="h-4 w-4" />
                                  <span className="hidden sm:inline">Detail</span>
                                </Button>
                              </Link>
                              {/* hafalan */}
                              <Link to={`/ortu/progress/hafalan/${santri.id}`}>
                                <Button size="sm" variant="outline" className="bg-green-500 text-white hover:bg-green-600 hover:text-white">
                                  <Notebook className="h-4 w-4" />
                                  <span className="hidden sm:inline">Hafalan</span>
                                </Button>
                              </Link>
                              {/* Riwayat */}
                              <Link to={`/ortu/riwayat/hafalan/${santri.id}`}>
                                <Button size="sm" variant="outline" className="bg-yellow-500 text-white hover:bg-yellow-600 hover:text-white">
                                  <Book className="h-4 w-4" />
                                  <span className="hidden sm:inline">Riwayat</span>
                                </Button>
                              </Link>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">
                          Tidak ada data santri.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {totalPages > 1 && (
              <div className="mt-4 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (!isPreviousButtonDisabled) {
                            setCurrentPage(currentPage - 1);
                          }
                        }}
                        className={`${isPreviousButtonDisabled ? "pointer-events-none opacity-50" : ""}`}
                      />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(1);
                        }}
                        isActive={currentPage === 1}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                    {totalPages > 2 && (
                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(totalPages);
                          }}
                          isActive={currentPage === totalPages}
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (!isNextButtonDisabled) {
                            setCurrentPage(currentPage + 1);
                          }
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
    </OrtuLayout>
  );
};

export default OrtuDashboard;