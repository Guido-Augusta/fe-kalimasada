import { LayoutDashboard, Users, UserCheck, GraduationCap, Trophy, Book } from "lucide-react";
import Layout from "@/components/share/Layout";

const adminSidebar = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Ustadz/ah", url: "/admin/ustadz", icon: UserCheck },
  { title: "Orang tua", url: "/admin/orangtua", icon: Users },
  { title: "Santri", url: "/admin/santri", icon: GraduationCap },
  { title: "Peringkat", url: "/admin/santri/peringkat", icon: Trophy },
  { title: "Alquran", url: "/admin/alquran", icon: Book },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout title="Admin Dashboard" sidebarItems={adminSidebar}>
      {children}
    </Layout>
  );
}