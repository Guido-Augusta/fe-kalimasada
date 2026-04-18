import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Loader2 } from 'lucide-react';
import { formatTahapHafalan } from '@/utils/tahapHafalan';

interface SantriListInterface {
  id: number;
  userId: number;
  nama: string;
  tahapHafalan: string;
  user: {
    email: string;
  };
  orangTua: {
    nama: string;
  }[] | null;
}

interface SantriTableProps {
  santriList: SantriListInterface[];
  isLoading: boolean;
  isError: boolean;
  currentPage?: number;
  itemsPerPage?: number;
}

const SantriTable: React.FC<SantriTableProps> = ({
  santriList,
  isLoading,
  isError,
}) => {
  return (
    <div className="w-full overflow-x-auto bg-white rounded-md mt-3 shadow-md">
      <div className="md:min-w-[640px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead className="hidden md:table-cell">Nama Ortu</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden md:table-cell">Tahapan</TableHead>
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
                <TableCell colSpan={7} className="text-center text-red-500">
                  Gagal memuat data santri. Coba lagi.
                </TableCell>
              </TableRow>
            ) : santriList.length > 0 ? (
              santriList.map((santri, _index) => (
                <TableRow key={santri.id}>
                  <TableCell className="font-medium">
                    {santri.nama.length > 15
                      ? santri.nama.substring(0, 10) + '...'
                      : santri.nama}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {santri.orangTua?.[0]?.nama || '-'}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {santri.user.email}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline">
                      {formatTahapHafalan(santri.tahapHafalan as string)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Link to={`/admin/santri-detail/${santri.id}`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-green-500 hover:bg-green-600 hover:text-white text-white"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Tidak ada data santri.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SantriTable;
