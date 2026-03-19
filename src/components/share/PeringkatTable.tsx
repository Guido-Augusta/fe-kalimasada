import { ArrowLeft, Loader2, User, Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { usePeringkatData } from "@/hooks/usePeringkatData";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { formatTahapHafalan } from "@/utils/tahapHafalan";
import { useNavigate } from "react-router-dom";
import { usePeringkatStore } from "@/store/usePeringkatStore";

interface PeringkatTableProps {
  initialPage?: number;
  limit?: number;
  baseUrl?: string;
}

export default function PeringkatTable({ limit = 10, baseUrl = "/santri" }: PeringkatTableProps) {
  const { currentPage, searchTerm, searchQuery, selectedTahap, setState } = usePeringkatStore();
  const navigate = useNavigate();

  const { data, isError, error: _error, isFetching } = usePeringkatData(currentPage, limit, searchQuery, selectedTahap);

  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      setState({ currentPage: 1, searchQuery: "" });
    } else {
      setState({ currentPage: 1, searchQuery: searchTerm });
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-red-500">
        <p>Gagal memuat data peringkat.</p>
      </div>
    );
  }

  const peringkatList = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;
  const isPreviousDisabled = currentPage <= 1 || isFetching;
  const isNextDisabled = currentPage >= totalPages || isFetching;

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages && !isFetching) {
      setState({ currentPage: page });
    }
  };

  const getVisiblePageNumbers = (current: number, total: number) => {
    const pages = [];
    if (total <= 5) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (current > 3) pages.push('...');
      if (current > 2 && current < total - 1) pages.push(current);
      if (current < total - 2) pages.push('...');
      if (current !== total) pages.push(total);
    }
    return pages;
  };

  const visiblePages = getVisiblePageNumbers(currentPage, totalPages);

  return (
    <>
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <Button variant="outline" size="sm" className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 hover:text-white text-white" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sm:inline">Kembali</span>
        </Button>
    </div>

    <Card className="shadow-lg">
      <CardHeader className="p-2">
        <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold">
              Peringkat Santri | <span className="text-primary">{formatTahapHafalan(selectedTahap)}</span>
            </CardTitle>
            <CardDescription>
              Daftar peringkat santri berdasarkan total poin hafalan.
            </CardDescription>
          </div>

          <div className="flex flex-col md:flex-row md:items-start gap-2">
            <Select 
                value={selectedTahap} 
                onValueChange={(value) => {
                    setState({ selectedTahap: value });
                    setState({ currentPage: 1 });
                }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tahap Hafalan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Level1">Level 1 - Juz 30</SelectItem>
                <SelectItem value="Level2">Level 2 - Surat Wajib</SelectItem>
                <SelectItem value="Level3">Level 3 - Juz 1-29</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-start gap-2">
                <div className="relative flex-grow max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="text"
                      placeholder="Cari santri..."
                      value={searchTerm}
                      onChange={(e) => {
                        const value = e.target.value;
                        setState({ searchTerm: value });
                        if (value.trim() === "") {
                          setState({ searchQuery: "" });
                        }
                      }}
                      onKeyDown={handleKeyDown}
                      className="pl-9"
                    />
                </div>
                <Button onClick={handleSearch} disabled={isFetching} className="bg-yellow-500 hover:bg-yellow-600 hover:text-white text-white">Cari</Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center w-[50px]">Peringkat</TableHead>
                <TableHead>Nama Santri</TableHead>
                <TableHead className="text-center">Tahap Hafalan</TableHead>
                <TableHead className="text-center">Total Poin</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isFetching ? (
                <TableRow>
                <TableCell colSpan={5} className="text-center">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="ml-2">Memuat...</span>
                  </div>
                </TableCell>
              </TableRow>
              ) : peringkatList.length > 0 ? (
                peringkatList.map((santri) => (
                  <TableRow key={santri.id} className={cn({ "bg-yellow-100 dark:bg-yellow-900": santri.peringkat <= 3 })}>
                    <TableCell className="text-center font-bold text-base">
                      {santri.peringkat}
                    </TableCell>
                    <TableCell className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={santri.fotoProfil || "https://res.cloudinary.com/dqrppoiza/image/upload/v1754292060/placeholder_profile_ff5xwy.jpg"} />
                        <AvatarFallback>
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{santri.nama}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-bold text-primary">
                      {formatTahapHafalan(santri.tahapHafalan)}
                    </TableCell>
                    <TableCell className="text-center font-bold text-primary">
                      {santri.totalPoin}
                    </TableCell>
                    <TableCell className="">
                      <div className="flex gap-2 items-center justify-center">
                        <Link to={`${baseUrl}/santri-detail/${santri.id}`}>
                          <Button variant="outline" size="sm" className="flex items-center gap-2 bg-green-500 hover:bg-green-600 hover:text-white text-white">
                            <User className="h-4 w-4" />
                            <span className="hidden sm:inline">Lihat</span>
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    <p>Tidak ada data peringkat {searchQuery ? `dengan nama "${searchQuery}"` : ""} </p>
                    <p>di kelas {formatTahapHafalan(selectedTahap)}.</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center p-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={cn("cursor-pointer", { "opacity-50 pointer-events-none": isPreviousDisabled })}
                />
              </PaginationItem>
              {visiblePages.map((page, index) => (
                <PaginationItem key={index}>
                  {typeof page === 'number' ? (
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={page === currentPage}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  ) : (
                    <span className="px-2">...</span>
                  )}
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={cn("cursor-pointer", { "opacity-50 pointer-events-none": isNextDisabled })}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </Card>
    </>
  );
}