import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut } from "lucide-react";
import { AppSidebar } from "./AppSidebar";
import { AppBreadcrumb } from "./AppBreadcrumb";
import useUser, { type User as UserStore } from "@/store/useUser";
import { Link } from "react-router-dom";
import { useLogout } from "@/features/authentication/hooks/useLogout";

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  sidebarItems: { title: string; url: string; icon: React.ElementType }[];
}

interface UserDetails {
  id: number;
  userId: number;
  nama: string;
  alamat: string;
  jenisKelamin: string;
  nomorHp: string;
  waliKelasTahap?: string;
  fotoProfil?: string;
  user?: {
    id: number;
    email: string;
    password?: string;
  };
}

function getUrlProfile(role: string) {
  switch (role) {
    case "admin":
      return "/admin/profile";
    case "ustadz":
      return "/ustadz/profile";
    case "ortu":
      return "/ortu/profile";
    case "santri":
      return "/santri/profile";
    default:
      return "/profile";
  }
}

const avatarFields: Record<string, (details: UserDetails) => string | undefined> = {
  santri: (details) => details?.fotoProfil,
  ustadz: (details) => details?.fotoProfil,
  ortu:   (details) => details?.fotoProfil,
};

function getAvatarUrl(user: UserStore | null ): string {
  // console.log('user', user?.details);
  const fallback = "https://res.cloudinary.com/dqrppoiza/image/upload/v1754292060/placeholder_profile_ff5xwy.jpg";
  if (!user) return fallback;

  const getter = avatarFields[user.role];
  return getter ? getter(user.details as UserDetails) || fallback : fallback;
}

export default function Layout({ children, sidebarItems }: LayoutProps) {
  const { user } = useUser()
  const logout = useLogout();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-100">
        <AppSidebar items={sidebarItems} />
        <div className="flex-1 flex flex-col w-full">
          <header className="sticky top-0 z-10 h-16 border-b border-border bg-card px-6 flex items-center justify-between">
            <div className="flex items-center">
              <SidebarTrigger className="mr-4" />
              { user?.role === "admin" ? 
                <AppBreadcrumb /> :
                <h1 className="text-xl font-semibold">Selamat Datang</h1>
               }
            </div>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={getAvatarUrl(user)} />
                    <AvatarFallback className="bg-blue-500 text-primary-foreground">
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                { user?.role !== "admin" ? (
                  <Link to={getUrlProfile(user?.role as string)}>
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profil</span>
                    </DropdownMenuItem>
                  </Link>
                ) : null}
                <DropdownMenuItem className="cursor-pointer" onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="flex-1 p-3 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
