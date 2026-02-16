import { Link } from 'react-router-dom';
import { Loader2, Notebook, Trash } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import type { RiwayatHafalan } from '@/features/ustadz/types/hafalan.type';
import { useDeleteRiwayatHafalan } from '@/features/ustadz/hooks/useHafalanData';
import { formatTanggalIndo } from '@/utils/formatDate';

interface RiwayatTableProps {
  riwayatList: RiwayatHafalan[];
  totalPages: number;
  currentPage: number;
  isFetching: boolean;
  onPageChange: (page: number) => void;
  idSantri: string;
  showDeleteButton?: boolean;
  role?: string;
  statusFilter?: string;
}

export default function RiwayatTable({
  riwayatList,
  totalPages,
  currentPage,
  isFetching,
  onPageChange,
  idSantri,
  showDeleteButton = false,
  role = 'ustadz',
  statusFilter,
}: RiwayatTableProps) {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [riwayatToDelete, setRiwayatToDelete] = useState<RiwayatHafalan | null>(
    null
  );
  const [tanggal, setTanggal] = useState<string | null>(null);
  const [namaSurah, setNamaSurah] = useState<string | null>(null);

  const deleteMutation = useDeleteRiwayatHafalan();

  const handleOpenDeleteDialog = (riwayat: RiwayatHafalan) => {
    setRiwayatToDelete(riwayat);
    setTanggal(riwayat.tanggal);
    setNamaSurah(riwayat.namaSurahLatin);
    setIsAlertOpen(true);
  };

  const handleConfirmDelete = () => {
    if (riwayatToDelete && idSantri) {
      deleteMutation.mutate(
        {
          santriId: parseInt(idSantri),
          surahId: riwayatToDelete.surahId,
          tanggal: riwayatToDelete.tanggal,
          status: riwayatToDelete.status,
        },
        {
          onSuccess: () => {
            setIsAlertOpen(false);
          },
        }
      );
    }
  };

  function getBadgeStatus(status: string) {
    switch (status) {
      case 'TambahHafalan':
        return 'bg-green-500 text-white';
      case 'Murajaah':
        return 'bg-yellow-500 text-white';
      default:
        return 'default';
    }
  }

  const isPreviousButtonDisabled =
    currentPage === 1 || isFetching || deleteMutation.isPending;
  const isNextButtonDisabled =
    currentPage === totalPages || isFetching || deleteMutation.isPending;

  return (
    <>
      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] text-center">Tanggal</TableHead>
              <TableHead className="text-center">Surah</TableHead>
              <TableHead className="text-center hidden md:table-cell">
                Status
              </TableHead>
              <TableHead className="text-center">Ayat</TableHead>
              {statusFilter === 'TambahHafalan' && (
                <TableHead className="text-center hidden md:table-cell">
                  Poin
                </TableHead>
              )}
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {riwayatList.length > 0 ? (
              riwayatList.map((riwayat, index) => (
                <TableRow key={index}>
                  <TableCell className="text-center">
                    {formatTanggalIndo(riwayat.tanggal)}
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {riwayat.namaSurahLatin}
                  </TableCell>
                  <TableCell className="text-center hidden md:table-cell">
                    <Badge className={getBadgeStatus(riwayat.status)}>
                      {riwayat.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {riwayat.rangeAyat?.awal && riwayat.rangeAyat?.akhir
                      ? `${riwayat.rangeAyat.awal}-${riwayat.rangeAyat.akhir}`
                      : '-'}
                  </TableCell>
                  {statusFilter === 'TambahHafalan' && (
                    <TableCell className="text-center hidden md:table-cell">
                      {riwayat.totalPoin}
                    </TableCell>
                  )}
                  <TableCell className="text-center flex items-center justify-center gap-2">
                    <Link
                      to={`/${role}/riwayat/detail/${idSantri}/surah/${riwayat.surahId}?tanggal=${riwayat.tanggal}&status=${riwayat.status}`}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 hover:text-white text-white"
                      >
                        <Notebook className="h-4 w-4" />
                        <span className="hidden sm:inline">Lihat</span>
                      </Button>
                    </Link>
                    {showDeleteButton && (
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => handleOpenDeleteDialog(riwayat)}
                        disabled={deleteMutation.isPending}
                      >
                        {deleteMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash className="h-4 w-4" />
                        )}
                        <span className="hidden sm:inline">Hapus</span>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  <p className="text-wrap">
                    Tidak ada riwayat hafalan dengan status {statusFilter}.
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
                    onPageChange(currentPage - 1);
                  }}
                  className={`${isPreviousButtonDisabled ? 'pointer-events-none opacity-50' : ''}`}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(1);
                  }}
                  isActive={currentPage === 1}
                >
                  1
                </PaginationLink>
              </PaginationItem>
              {totalPages > 2 && currentPage > 2 && (
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
              {totalPages > 2 && currentPage < totalPages - 1 && (
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
                      onPageChange(totalPages);
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
                    onPageChange(currentPage + 1);
                  }}
                  className={`${isNextButtonDisabled ? 'pointer-events-none opacity-50' : ''}`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {showDeleteButton && (
        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Konfirmasi Hapus Riwayat</AlertDialogTitle>
              <AlertDialogDescription>
                <span className="font-bold text-black">
                  {tanggal} - {namaSurah}
                </span>
                <br />
                <span>
                  Apakah Anda yakin ingin menghapus riwayat{' '}
                  {statusFilter === 'Murajaah' ? 'Murajaah' : 'Hafalan'} ini?
                  Tindakan ini tidak dapat dibatalkan.
                </span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                disabled={deleteMutation.isPending}
                className="bg-primary hover:bg-primary/80 text-white hover:text-white"
              >
                Batal
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                disabled={deleteMutation.isPending}
                className="bg-destructive hover:bg-destructive/80 text-white"
              >
                {deleteMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
