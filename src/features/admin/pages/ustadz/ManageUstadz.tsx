import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, } from "@/components/ui/pagination";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "@/components/ui/alert-dialog";
import { Plus, Search, Eye, Edit, Trash2, Loader2 } from "lucide-react";
import AdminLayout from "../../components/AdminLayout";
import { Link } from "react-router-dom";
import { useUstadzList, useDeleteUstadzMutation, } from "../../hooks/useUstadzData";
import { useUstadzStore } from "@/store/useUstadzStore";

const ManageUstadz = () => {
  const { currentPage, searchQuery, searchFilter, setState } = useUstadzStore();
  const itemsPerPage = 10;

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [ustadzToDelete, setUstadzToDelete] = useState<number | null>(null);
  const [selectedUstadz, setSelectedUstadz] = useState<string>("");

  const { data, isLoading, isError, isFetching } = useUstadzList(currentPage, itemsPerPage, searchFilter);
  const deleteMutation = useDeleteUstadzMutation();

  const ustadzList = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;

  const handleSearchChange = (value: string) => {
    setState({ searchQuery: value });

    if (value.trim() === "") {
      setState({ searchFilter: "", currentPage: 1 });
    }
  };

  const handleSearchSubmit = () => {
    setState({ searchFilter: searchQuery, currentPage: 1 });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  const isPreviousButtonDisabled = currentPage === 1 || isFetching;
  const isNextButtonDisabled = currentPage === totalPages || isFetching;

  const handleDeleteClick = (ustadzId: number, ustadzName: string) => {
    setSelectedUstadz(ustadzName);
    setUstadzToDelete(ustadzId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (ustadzToDelete !== null) {
      deleteMutation.mutate(ustadzToDelete);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-violet-600">Manage Ustadz/Ustadzah</h2>
          <p className="text-muted-foreground">Manage Ustadz/Ustadzah data</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-violet-600">Daftar Ustadz/Ustadzah</CardTitle>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative flex items-center gap-2 flex-1 max-w-sm">
                <Input
                  placeholder="Cari nama ustadz..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pr-10"
                />
                <Button onClick={handleSearchSubmit} className="flex-shrink-0 bg-yellow-500 hover:bg-yellow-600 hover:text-white">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              <Link to="/admin/ustadz/add">
                <Button className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 hover:text-white">
                  <Plus className="h-4 w-4" />
                  Tambah
                </Button>
              </Link>
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
                      <TableHead className="hidden md:table-cell">Email</TableHead>
                      <TableHead className="hidden md:table-cell">No Telp</TableHead>
                      <TableHead className="hidden md:table-cell">Jenis Kelamin</TableHead>
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
                          Gagal memuat data ustadz. Coba lagi.
                        </TableCell>
                      </TableRow>
                    ) : ustadzList.length > 0 ? (
                      ustadzList.map((ustadz, index) => (
                        <TableRow key={ustadz.id}>
                          <TableCell className="font-medium">
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </TableCell>
                          <TableCell className="font-medium">
                            {ustadz.nama.length > 15 ? ustadz.nama.substring(0, 10) + "..." : ustadz.nama}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{ustadz.user.email}</TableCell>
                          <TableCell className="hidden md:table-cell">{ustadz.nomorHp}</TableCell>
                          <TableCell className="hidden md:table-cell">{ustadz.jenisKelamin === "L" ? "Laki-laki" : "Perempuan"}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex gap-2 justify-center">
                              <Link to={`/admin/ustadz/detail/${ustadz.id}`}>
                                <Button size="sm" variant="outline" className="bg-green-500 text-white hover:bg-green-600 hover:text-white">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link to={`/admin/ustadz/edit/${ustadz.id}`}>
                                <Button size="sm" variant="outline" className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteClick(ustadz.id, ustadz.nama)}
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
                          Tidak ada data ustadz.
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
              menghapus data ustadz/ustadzah (<span className="font-bold text-black">{selectedUstadz}</span>).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-primary text-primary-foreground hover:bg-primary/80 hover:text-white">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-white hover:bg-destructive/80"
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

export default ManageUstadz;

