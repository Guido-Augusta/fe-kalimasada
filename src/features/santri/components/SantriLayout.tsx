import { GraduationCap, History } from "lucide-react";
import Layout from "@/components/share/Layout";

const santriSidebar = [
  { title: "Daftar Surah", url: "/santri", icon: GraduationCap },
  { title: "Riwayat Hafalan", url: "/santri/riwayat/hafalan", icon: History },
];

export default function SantriLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout title="Santri Dashboard" sidebarItems={santriSidebar}>
      {children}
    </Layout>
  );
}