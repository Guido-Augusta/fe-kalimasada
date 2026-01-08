import { GraduationCap } from "lucide-react";
import Layout from "@/components/share/Layout";
import { Book } from "lucide-react";

const ortuSidebar = [
  { title: "Daftar anak", url: "/ortu", icon: GraduationCap },
  { title: "Alquran", url: "/ortu/alquran", icon: Book },
];

export default function OrtuLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout title="Ortu Dashboard" sidebarItems={ortuSidebar}>
      {children}
    </Layout>
  );
}