import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Mail, Phone, MapPin, User, Shield, School } from "lucide-react";
import type { UstadzDetailData } from "@/features/admin/types/ustad.type";
import { Link } from "react-router-dom";
import { formatTahapHafalan } from "@/utils/tahapHafalan";
import useUser from "@/store/useUser";
import { WhatsAppButton } from "./WhatsAppButton";
interface UstadProfileCardProps { 
  ustadData: UstadzDetailData; 
  baseUrl?: string;
  role?: string;
}

export default function UstadProfileCard({ ustadData, role }: UstadProfileCardProps) {
  const { user } = useUser();

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24 sm:h-32 sm:w-32">
                  <AvatarImage 
                    src={ustadData.fotoProfil || "https://res.cloudinary.com/dqrppoiza/image/upload/v1754292060/placeholder_profile_ff5xwy.jpg"} 
                    alt={ustadData.nama}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-lg sm:text-xl bg-primary text-primary-foreground">
                    {ustadData.nama.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-xl sm:text-2xl">{ustadData.nama}</CardTitle>
              <div className="flex justify-center mt-2">
                <Badge variant="secondary" className="bg-slate-600 text-white">
                  <Shield className="h-3 w-3 mr-1" />
                  {ustadData.user.role}
                </Badge>
              </div>
            </CardHeader>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informasi Personal
                </div>
                { role === "ustadz" && ustadData.id === Number(user?.roleId) && (
                  <div className="flex md:flex-row flex-col items-center gap-2">
                    <Link to={`/ustadz/edit/profile/`}>
                      <Button variant="default" size="sm" className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 hover:text-white text-white">Edit Profil</Button>
                    </Link>
                    <Link to={`/ustadz/change-password/`}>
                      <Button variant="default" size="sm" className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 hover:text-white text-white">Ganti Kata Sandi</Button>
                    </Link>
                  </div>
                )}
              </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      Email
                    </div>
                    <p className="font-medium break-all">{ustadData.user.email}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      Nomor Telepon
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{ustadData.nomorHp}</p>
                        <WhatsAppButton phoneNumber={ustadData.nomorHp}/>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      Alamat
                    </div>
                    <p className="font-medium">{ustadData.alamat}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      Jenis Kelamin
                    </div>
                    <p className="font-medium">
                      {ustadData.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                    </p>
                  </div>

                </div>

                { ustadData.waliKelasTahap && 
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <School className="h-4 w-4" />
                      Penanggung Jawab Kelas
                    </div>
                    <p className="font-semibold text-sm">
                        {formatTahapHafalan(ustadData.waliKelasTahap)}
                    </p>
                  </div>
                }

              </CardContent>
            </Card>
          </div>
      </div>
    </>
  )
}
