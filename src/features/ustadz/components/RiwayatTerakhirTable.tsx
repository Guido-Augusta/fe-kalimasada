import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatTanggalIndo } from "@/utils/formatDate";
import { CommandList } from "cmdk";
import { ChevronsUpDown, Eye, Loader2, Notebook } from "lucide-react";
import { Link } from "react-router-dom";
import type { RiwayatHafalanTerakhirSantri } from "../types/hafalan.type";

interface RiwayatTerakhirTableProps {
  dataList: RiwayatHafalanTerakhirSantri[];
  statusFilter: string;
  mode: 'surah' | 'juz';
  open: boolean;
  setOpen: (open: boolean) => void;
  value: string;
  sortAyat: { value: string; label: string }[];
  handleSortAyatChange: (value: string) => void;
  openHalaman?: boolean;
  setOpenHalaman?: (open: boolean) => void;
  valueHalaman?: string;
  sortHalaman?: { value: string; label: string }[];
  handleSortHalamanChange?: (value: string) => void;
  searchName?: string;
  isFetching?: boolean;
  isLoading?: boolean;
  isError?: boolean;
  currentPage?: number;
  itemsPerPage?: number;
}

export default function RiwayatTerakhirTable({
  dataList,
  statusFilter,
  mode,
  open,
  setOpen,
  value,
  sortAyat,
  handleSortAyatChange,
  openHalaman,
  setOpenHalaman,
  valueHalaman,
  sortHalaman,
  handleSortHalamanChange,
  searchName,
  isFetching,
  isLoading,
  isError,
  currentPage,
  itemsPerPage,
}: RiwayatTerakhirTableProps) {


  return (
    <div className="w-full overflow-x-auto">
      <div className="md:min-w-[640px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16 text-center">No</TableHead>
              <TableHead className="text-center">Nama Santri</TableHead>
              <TableHead className="text-center">Tanggal</TableHead>
              {mode === 'surah' ? (
                <>
                  <TableHead className="text-center">Surah</TableHead>
                  <TableHead className="text-center">
                    { statusFilter === "TambahHafalan" ? (
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" role="combobox" aria-expanded={open} className="w-[110px] justify-between">
                            { sortAyat.find((item) => item.value === value)?.label || "Ayat" } 
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[120px] p-0">
                          <Command>
                            <CommandList>
                              <CommandEmpty>No ayat found.</CommandEmpty>
                              <CommandGroup>
                                {sortAyat.map((item) => (
                                  <CommandItem
                                    key={item.value}
                                    value={item.value}
                                    onSelect={(currentValue) => {
                                      handleSortAyatChange(currentValue);
                                    }}
                                  >
                                    {item.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    ) : (
                      <span>Ayat</span>
                    )}
                  </TableHead>
                </>
              ) : (
                <>
                  <TableHead className="text-center">Juz</TableHead>
                  <TableHead className="text-center">
                    {statusFilter === "TambahHafalan" && openHalaman !== undefined && setOpenHalaman && valueHalaman !== undefined && sortHalaman && handleSortHalamanChange ? (
                      <Popover open={openHalaman} onOpenChange={setOpenHalaman}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" role="combobox" aria-expanded={openHalaman} className="w-[110px] justify-between">
                            { sortHalaman.find((item) => item.value === valueHalaman)?.label || "Halaman" } 
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[120px] p-0">
                          <Command>
                            <CommandList>
                              <CommandEmpty>No halaman found.</CommandEmpty>
                              <CommandGroup>
                                {sortHalaman.map((item) => (
                                  <CommandItem
                                    key={item.value}
                                    value={item.value}
                                    onSelect={(currentValue) => {
                                      handleSortHalamanChange(currentValue);
                                    }}
                                  >
                                    {item.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    ) : (
                      <span>Halaman</span>
                    )}
                  </TableHead>
                  <TableHead className="text-center">Surah</TableHead>
                </>
              )}
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={mode === 'surah' ? 7 : 8} className="text-center">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <p>Memuat data...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={mode === 'surah' ? 7 : 8} className="text-center">
                  <p className="text-red-500">Gagal memuat data riwayat terakhir.</p>
                </TableCell>
              </TableRow>
            ) : (
            dataList.length > 0 ? (
              dataList.map((riwayat, index) => (
                <TableRow key={index} >
                  <TableCell className="text-center">
                    {((currentPage || 1) - 1) * (itemsPerPage || 10) + index + 1}
                  </TableCell>
                  <TableCell className="text-left font-medium text-wrap">
                    {riwayat.nama.length > 15 ? riwayat.nama.substring(0, 10) + "..." : riwayat.nama}
                  </TableCell>
                  <TableCell className="text-center">{formatTanggalIndo(riwayat.terakhirHafalan?.tanggal ?? '-')}</TableCell>
                  {mode === 'surah' ? (
                    <>
                      <TableCell className="text-center">{riwayat.terakhirHafalan?.surah ?? '-'}</TableCell>
                      <TableCell className="text-center">{riwayat.terakhirHafalan?.ayatDetail ?? '-'}</TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell className="text-center">{riwayat.terakhirHafalan?.juz ?? '-'}</TableCell>
                      <TableCell className="text-center">{riwayat.terakhirHafalan?.halamanDetail ?? '-'}</TableCell>
                      <TableCell className="text-center">
                        {riwayat.terakhirHafalan?.surahList?.map(s => s.namaLatin).join(', ') || '-'}
                      </TableCell>
                    </>
                  )}
                  { riwayat.terakhirHafalan?.status ? (
                    <TableCell className="text-center">
                      <div className="flex gap-2 justify-start">
                        {mode === 'surah' ? (
                          <>
                            <Link to={`/ustadz/hafalan/${riwayat.id}/${riwayat.terakhirHafalan?.surahId}`}>
                              <Button variant="outline" size="sm" className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-white hover:text-white">
                                <span className="sm:inline">{riwayat.terakhirHafalan?.surah}</span>
                              </Button>
                            </Link>
                            <Link to={`/ustadz/riwayat/detail/${riwayat.id}/surah/${riwayat.terakhirHafalan?.surahId}?tanggal=${riwayat.terakhirHafalan?.tanggal}&status=${riwayat.terakhirHafalan?.status}`}>
                              <Button variant="outline" size="sm" className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 hover:text-white text-white">
                                <Eye className="h-4 w-4" />
                                <span className="hidden sm:inline">Lihat</span>
                              </Button>
                            </Link>
                          </>
                        ) : (
                          <>
                            <Link to={`/ustadz/hafalan/${riwayat.id}/juz/${riwayat.terakhirHafalan?.juz}`}>
                              <Button variant="outline" size="sm" className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-white hover:text-white">
                                <span className="sm:inline">Juz {riwayat.terakhirHafalan?.juz}</span>
                              </Button>
                            </Link>
                            <Link to={`/ustadz/riwayat/detail/${riwayat.id}/juz/${riwayat.terakhirHafalan?.juz}?tanggal=${riwayat.terakhirHafalan?.tanggal}&status=${riwayat.terakhirHafalan?.status}`}>
                              <Button variant="outline" size="sm" className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 hover:text-white text-white">
                                <Eye className="h-4 w-4" />
                                <span className="hidden sm:inline">Lihat</span>
                              </Button>
                            </Link>
                          </>
                        )}
                        <Link to={`/ustadz/progress/hafalan/${riwayat.id}`}>
                          <Button size="sm" variant="outline" className="bg-green-500 text-white hover:bg-green-600 hover:text-white">
                            <Notebook className="h-4 w-4" />
                            <span className="hidden sm:inline">Hafalan</span>
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  ) : (
                    <TableCell className="text-start"><p className="text-wrap">Belum ada riwayat hafalan</p></TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={mode === 'surah' ? 7 : 8} className="text-center text-muted-foreground">
                {searchName ? (
                  <p className="text-wrap">
                    Tidak ada riwayat hafalan atas nama {searchName} yang ditemukan.
                  </p>
                ) : isFetching ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading data riwayat terakhir...</span>
                  </div>
                ) : (
                  <p className="text-wrap">Tidak ada riwayat hafalan yang ditemukan.</p>
                )}
                </TableCell>
              </TableRow>
            )
          )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}