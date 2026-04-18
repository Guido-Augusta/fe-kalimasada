import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Search, Loader2, Eye, Book, Notebook } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSantriList } from '../admin/hooks/useSantriData';
import UstadzLayout from './components/UstadzLayout';
import { formatTahapHafalan } from '@/utils/tahapHafalan';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSantriStore } from '@/store/useSantriStore';

const UstadzDashboard = () => {
  const { currentPage, searchQuery, searchFilter, selectedTahap, setState } =
    useSantriStore();
  const itemsPerPage = 10;

  const { data, isLoading, isError, isFetching } = useSantriList(
    currentPage,
    itemsPerPage,
    searchFilter,
    { tahapHafalan: selectedTahap }
  );

  const santriList = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;

  const handleSearchChange = (value: string) => {
    setState({ searchQuery: value });

    if (value.trim() === '') {
      setState({ searchFilter: '', currentPage: 1 });
    }
  };

  const handleSearchSubmit = () => {
    setState({ searchFilter: searchQuery, currentPage: 1 });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const isPreviousButtonDisabled = currentPage === 1 || isFetching;
  const isNextButtonDisabled = currentPage === totalPages || isFetching;

  return (
    <UstadzLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-violet-600/90">
            Daftar Santri
          </h2>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-violet-600/90">Daftar Santri</CardTitle>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative flex items-center gap-2 flex-1 max-w-sm">
                <Input
                  placeholder="Cari nama santri..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pr-10"
                />
                <Button
                  onClick={handleSearchSubmit}
                  className="flex-shrink-0 bg-yellow-500 hover:bg-yellow-600 text-white hover:text-white"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>

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
                      <TableHead className="hidden md:table-cell">
                        Nama Ortu
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Tahapan
                      </TableHead>
                      <TableHead className="text-center">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
                          <p className="flex items-center gap-2 md:justify-center">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Memuat...
                          </p>
                        </TableCell>
                      </TableRow>
                    ) : isError ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center text-red-500"
                        >
                          {/* Error: {error?.message} */}
                          Gagal memuat data santri. Coba lagi.
                        </TableCell>
                      </TableRow>
                    ) : santriList.length > 0 ? (
                      santriList.map((santri, _index) => (
                        <TableRow key={santri.id}>
                          <TableCell className="font-medium">
                            {(currentPage - 1) * itemsPerPage + _index + 1}
                          </TableCell>
                          <TableCell className="font-medium">
                            {santri.nama.length > 15
                              ? santri.nama.substring(0, 10) + '...'
                              : santri.nama}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {santri.orangTua?.[0]?.nama || '-'}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant="outline">
                              {formatTahapHafalan(santri.tahapHafalan)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex gap-2 justify-center">
                              <Link to={`/ustadz/santri-detail/${santri.id}`}>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
                                >
                                  <Eye className="h-4 w-4" />
                                  <span className="hidden sm:inline">
                                    Detail
                                  </span>
                                </Button>
                              </Link>
                              {/* hafalan */}
                              <Link
                                to={`/ustadz/progress/hafalan/${santri.id}`}
                              >
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="bg-green-500 text-white hover:bg-green-600 hover:text-white"
                                >
                                  <Notebook className="h-4 w-4" />
                                  <span className="hidden sm:inline">
                                    Hafalan
                                  </span>
                                </Button>
                              </Link>
                              {/* Riwayat */}
                              <Link to={`/ustadz/riwayat/hafalan/${santri.id}`}>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="bg-yellow-500 text-white hover:bg-yellow-600 hover:text-white"
                                >
                                  <Book className="h-4 w-4" />
                                  <span className="hidden sm:inline">
                                    Riwayat
                                  </span>
                                </Button>
                              </Link>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
                          <p>
                            Tidak ada data santri{' '}
                            {searchQuery
                              ? `dengan name "${searchQuery}"`
                              : ''}{' '}
                          </p>
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
                        className={`${isPreviousButtonDisabled ? 'pointer-events-none opacity-50' : ''}`}
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
                    {totalPages > 2 && (
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
                        className={`${isNextButtonDisabled ? 'pointer-events-none opacity-50' : ''}`}
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
};

export default UstadzDashboard;
