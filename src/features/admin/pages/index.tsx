import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, GraduationCap, TrendingUp } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { Link } from "react-router-dom";
import { useOrtuList } from "../hooks/useOrtuData";
import { useSantriList } from "../hooks/useSantriData";
import { useUstadzList } from "../hooks/useUstadzData";

const AdminDashboard = () => {
  const { data: ortuList } = useOrtuList(1, 10, "");
  const totalOrtu = ortuList?.pagination.totalData || 0;

  const { data: santriList } = useSantriList(1, 10, "");
  const totalSantri = santriList?.totalSantri || 0;

  const { data: ustadzList } = useUstadzList(1, 10, "");
  const totalUstadz = ustadzList?.pagination.totalData || 0;

  const stats = [
    {
      title: "Total Santri",
      value: totalSantri,
      icon: GraduationCap,
    },
    {
      title: "Total Ustadz/Ustadzah",
      value: totalUstadz,
      icon: UserCheck,
    },
    {
      title: "Total Orang Tua",
      value: totalOrtu,
      icon: Users,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-violet-600">Dashboard</h2>
          <p className="text-muted-foreground">
            Selamat datang di dashboard admin
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow bg-violet-600/90">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm text-white font-semibold">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-6 w-6 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <p className="text-xs text-white">
                  Dari bulan lalu
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-violet-600">Aksi Cepat</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <button className="p-4 text-left rounded-lg border border-border transition-colors bg-violet-600/90 text-white hover:bg-violet-700">
                  <Link to="/admin/ustadz">
                    <UserCheck className="h-8 w-8 text-yellow-400 mb-2" />
                    <h3 className="font-medium text-sm">Tambah Ustadz/Ustadzah</h3>
                    <p className="text-xs text-white">Daftarkan ustadz/ustadzah baru</p>
                  </Link>
                </button>
                <button className="p-4 text-left rounded-lg border border-border transition-colors bg-violet-600/90 text-white hover:bg-violet-700">
                  <Link to="/admin/santri">
                    <GraduationCap className="h-8 w-8 text-yellow-400 mb-2" />
                    <h3 className="font-medium text-sm">Tambah Santri</h3>
                    <p className="text-xs text-white">Daftarkan santri baru</p>
                  </Link>
                </button>
                <button className="p-4 text-left rounded-lg border border-border transition-colors bg-violet-600/90 text-white hover:bg-violet-700">
                  <Link to="/admin/orangtua">
                    <Users className="h-8 w-8 text-yellow-400 mb-2" />
                    <h3 className="font-medium text-sm">Tambah Orang Tua</h3>
                    <p className="text-xs text-white">Daftarkan orang tua baru</p>
                  </Link>
                </button>
                <button className="p-4 text-left rounded-lg border border-border transition-colors bg-violet-600/90 text-white hover:bg-violet-700">
                  <Link to="/admin/santri/peringkat">
                  <TrendingUp className="h-8 w-8 text-yellow-400 mb-2" />
                  <h3 className="font-medium text-sm">Peringkat</h3>
                  <p className="text-xs text-white">Lihat peringkat santri</p>
                  </Link>    
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;