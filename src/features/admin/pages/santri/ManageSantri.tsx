import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "@/components/ui/alert-dialog";
import { Plus, Search, Eye, Edit, Trash2, Loader2 } from "lucide-react";
import AdminLayout from "../../components/AdminLayout";
import { Link } from "react-router-dom";
import { useSantriList, useDeleteSantriMutation, } from "../../hooks/useSantriData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatTahapHafalan } from "@/utils/tahapHafalan";
import { useSantriStore } from "@/store/useSantriStore";

const ManageSantri = () => {
  const { currentPage, searchQuery, searchFilter, selectedTahap, setState } = useSantriStore();

  const itemsPerPage = 10;

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [santriToDelete, setSantriToDelete] = useState<number | null>(null);
  const [selectedSantri, setSelectedSantri] = useState<string>("");

  const { data, isLoading, isError, isFetching } = useSantriList( currentPage, itemsPerPage, searchFilter, { tahapHafalan: selectedTahap });
  const deleteMutation = useDeleteSantriMutation();

  const santriList = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;

  const handleSearchChange = (value: string) => {
    setState({ searchQuery: value });
  
    if (value.trim() === "") {
      setState({ searchFilter: "", currentPage: 1 });
    }
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim() === "") {
      setState({ searchFilter: "", currentPage: 1 });
    } else {
      setState({ searchFilter: searchQuery, currentPage: 1 });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };
  
  const isPreviousButtonDisabled = currentPage === 1 || isFetching;
  const isNextButtonDisabled = currentPage === totalPages || isFetching;

  const handleDeleteClick = (santriId: number, santriName: string) => {
    setSelectedSantri(santriName);
    setSantriToDelete(santriId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (santriToDelete !== null) {
      deleteMutation.mutate(santriToDelete);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-violet-600">Manage Santri</h2>
          <p className="text-muted-foreground">Manage Santri data</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-violet-600">Daftar Santri</CardTitle>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative flex items-center gap-2 flex-1 max-w-sm">
                <Input
                  placeholder="Cari nama santri..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pr-10"
                />
                <Button onClick={handleSearchSubmit} className="flex-shrink-0 bg-yellow-500 hover:bg-yellow-600 hover:text-white text-white">
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex md:flex-row md:items-center gap-2">
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
                <Link to="/admin/santri/add">
                  <Button className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 hover:text-white text-white">
                    <Plus className="h-4 w-4" />
                    Tambah
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-x-auto">
              <div className="md:min-w-[640px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead className="hidden md:table-cell">Nama Ortu</TableHead>
                      <TableHead className="hidden md:table-cell">Tahapan</TableHead>
                      <TableHead className="text-center">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">
                          <p className="flex items-center gap-2 md:justify-center">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Memuat...
                          </p>
                        </TableCell>
                      </TableRow>
                    ) : isError ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center text-red-500"
                        >
                          {/* Error: {error?.message} */}
                          Gagal memuat data santri. Coba lagi.
                        </TableCell>
                      </TableRow>
                    ) : santriList.length > 0 ? (
                      santriList.map((santri, _index) => (
                        <TableRow key={santri.id}>
                          <TableCell className="font-medium text-left">
                            {santri.nama.length > 15 ? santri.nama.substring(0, 10) + "..." : santri.nama}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{santri.orangTua?.[0]?.nama || "-"}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {formatTahapHafalan(santri.tahapHafalan)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-center">
                              <Link to={`/admin/santri-detail/${santri.id}`}>
                                <Button size="sm" variant="outline" className="bg-green-500 hover:bg-green-600 hover:text-white text-white">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link to={`/admin/santri/edit/${santri.id}`}>
                                <Button size="sm" variant="outline" className="bg-blue-500 hover:bg-blue-600 hover:text-white text-white">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteClick(santri.id, santri.nama)}
                                disabled={deleteMutation.isPending}
                              >
                                {deleteMutation.isPending ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">
                        <p>Tidak ada data santri {searchQuery ? `dengan nama "${searchQuery}"` : ""} </p>
                        <p>di kelas {formatTahapHafalan(selectedTahap)}.</p>
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
                            setState({ currentPage: currentPage - 1 });
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
                          setState({ currentPage: 1 });
                        }}
                        isActive={currentPage === 1}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>

                    {currentPage > 2 && totalPages > 2 && (
                      <PaginationItem>
                        <span className="px-2">...</span>
                      </PaginationItem>
                    )}

                    {currentPage > 1 && currentPage < totalPages && (
                      <PaginationItem>
                        <PaginationLink href="#" isActive={true}>
                          {currentPage}
                        </PaginationLink>
                      </PaginationItem>
                    )}

                    {currentPage < totalPages - 1 && totalPages > 2 && (
                      <PaginationItem>
                        <span className="px-2">...</span>
                      </PaginationItem>
                    )}

                    {totalPages > 1 && (
                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setState({ currentPage: totalPages });
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
                            setState({ currentPage: currentPage + 1 });
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
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak bisa dibatalkan. Ini akan secara permanen
              menghapus data santri (<span className="font-bold text-black">{selectedSantri}</span>).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-primary hover:bg-primary/80 text-white hover:text-white">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive hover:bg-destructive/80 text-white"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Hapus"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default ManageSantri;
