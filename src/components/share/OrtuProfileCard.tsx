import { Phone, MapPin, User, Mail, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { OrtuDetailData } from "@/features/admin/types/ortu.type";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { WhatsAppButton } from "./WhatsAppButton";

interface OrtuProfileCardProps { 
  ortuData: OrtuDetailData; 
  role?: string;
}

export default function OrtuProfileCard({ ortuData, role }: OrtuProfileCardProps) {
  return (
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24 sm:h-32 sm:w-32">
                  <AvatarImage
                    src={ortuData.fotoProfil || "https://res.cloudinary.com/dqrppoiza/image/upload/v1754292060/placeholder_profile_ff5xwy.jpg"}
                    alt={ortuData.nama}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-lg sm:text-xl bg-primary text-primary-foreground">
                    {ortuData.nama.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-xl sm:text-2xl">{ortuData.nama}</CardTitle>
              <div className="flex justify-center mt-2">
                <Badge variant="secondary" className="capitalize bg-violet-600 text-white">
                  <Shield className="h-3 w-3 mr-1" />
                  {ortuData.user.role == "ortu" ? "Orang Tua" : "Admin"}
                </Badge>
              </div>
            </CardHeader>
          </Card>
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
                { role === "ortu" && (
                  <div className="flex md:flex-row flex-col items-center gap-2">
                    <Link to={`/ortu/edit/profile/`}>
                      <Button variant="default" size="sm" className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 hover:text-white text-white">Edit Profil</Button>
                    </Link>
                    <Link to={`/ortu/change-password/`}>
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
                  <p className="font-medium break-all">{ortuData.user.email}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    Nomor Telepon
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{ortuData.nomorHp}</p>
                    <WhatsAppButton phoneNumber={ortuData.nomorHp}/>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  Alamat
                </div>
                <p className="font-medium">{ortuData.alamat}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 pt-4 border-t">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    Jenis Kelamin
                  </div>
                  <p className="font-medium">
                    {ortuData.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    Peran
                  </div>
                  <p className="font-medium">
                    {ortuData.tipe}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  );
}