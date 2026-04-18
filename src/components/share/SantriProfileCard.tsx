import { User, Mail, Shield, Loader2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

import { useState } from "react";
import { useChartData } from "@/features/admin/hooks/useChartData";
import type { SantriDetailData } from "@/features/admin/types/santri.type";
import { HafalanChart } from "@/features/admin/components/HafalanChart";
import { formatTahapHafalan } from "@/utils/tahapHafalan";


interface SantriProfileCardProps {
  santriData: SantriDetailData;
  baseUrl: string;
  role?: string;
  onUpdateHafalanClick?: () => void;
}

export default function SantriProfileCard({ santriData, baseUrl, role, onUpdateHafalanClick }: SantriProfileCardProps) {
  const [chartRange, setChartRange] = useState('1w');
  const [chartMode, setChartMode] = useState('ayat');

  const { data: chartData, isLoading: isChartLoading, isError: isChartError } = useChartData(
    String(santriData.id),
    chartRange,
    chartMode
  );

  const handleRangeChange = (newRange: string) => {
    setChartRange(newRange);
  };

  const handleModeChange = (newMode: string) => {
    setChartMode(newMode);
  };

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24 sm:h-32 sm:w-32">
                  <AvatarImage 
                    src={""} 
                    alt={santriData.nama}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-lg sm:text-xl bg-primary text-primary-foreground">
                    {santriData.nama.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-xl sm:text-2xl">{santriData.nama}</CardTitle>
              <div className="flex justify-center mt-2">
                <Badge variant="secondary" className="capitalize bg-blue-600 text-white">
                  <Shield className="h-3 w-3 mr-1" />
                  {santriData.user.role == "santri" ? "Santri" : "Admin"}
                </Badge>
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm font-semibold text-muted-foreground">Tahap Hafalan :</p>
                <p className="text-sm font-semibold">{formatTahapHafalan(santriData.tahapHafalan)}</p>
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm font-semibold text-muted-foreground">Total Poin :</p>
                <p className="text-sm font-semibold">{santriData.totalPoin}</p>
              </div>
              { role === "admin" || role == "ustadz" && (
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm font-semibold text-muted-foreground">Peringkat :</p>
                    <p className="text-sm font-semibold">{santriData.peringkat}</p>
                  </div>
                )
              }
            </CardHeader>
          </Card>
          { role === "ustadz" && (
            <Button className="mt-4 w-full" onClick={onUpdateHafalanClick}>
              Ubah Tahap Hafalan
            </Button>
          )}
        </div>

        {/* Kolom Informasi Personal */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informasi Personal
                </div>
                { role === "santri" && (
                  <div className="flex md:flex-row flex-col items-center gap-2">
                    <Link to={`/santri/edit/profile`}>
                      <Button variant="default" size="sm" className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 hover:text-white text-white">Edit Profil</Button>
                    </Link>
                    <Link to={`/santri/change-password`}>
                      <Button variant="default" size="sm" className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 hover:text-white text-white">Ganti Kata Sandi</Button>
                    </Link>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    Email
                  </div>
                  <p className="font-medium break-all">{santriData.user.email}</p>
                </div>

              <div className="grid gap-4 sm:grid-cols-2 pt-4 border-t">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      Penanggung Jawab Kelas
                    </div>
                    <div className="text-sm font-semibold">
                      {santriData.waliKelas.map((item) => (
                        <div key={item.id} className="flex gap-2 items-center my-2">
                          <p className="font-medium">
                            {item.nama}
                          </p>
                          <Link to={`${baseUrl}/ustadz/detail/${item.id}`}>
                            <Button variant="outline" size="sm" className="flex items-center gap-2 bg-green-500 hover:bg-green-600 hover:text-white text-white">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    Orang Tua
                  </div>
                  <div className="">
                    {santriData.orangTua.map((item) => (
                      <div key={item.id} className="flex gap-2 items-center my-2">
                        <p className="font-medium">
                          {item.nama} - {item.tipe}
                        </p>
                        <Link to={`${baseUrl}/orangtua/detail/${item.id}`}>
                          <Button variant="outline" size="sm" className="flex items-center gap-2 bg-green-500 hover:bg-green-600 hover:text-white text-white">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Komponen Chart */}
      <div className="mt-6">
        {isChartLoading ? (
          <Card>
            <CardContent className="h-[400px] flex justify-center items-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </CardContent>
          </Card>
        ) : isChartError ? (
          <Card>
            <CardContent className="h-[400px] flex justify-center items-center text-red-500">
              <p>Gagal memuat data grafik.</p>
            </CardContent>
          </Card>
        ) : (
          <HafalanChart
            data={chartData || []}
            namaSantri={santriData.nama}
            range={chartRange}
            onRangeChange={handleRangeChange}
            mode={chartMode}
            onModeChange={handleModeChange}
          />
        )}
      </div>
    </>
  );
}