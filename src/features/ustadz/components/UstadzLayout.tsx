import { Book, GraduationCap, Notebook, Trophy, User } from "lucide-react";
import Layout from "@/components/share/Layout";
import useUser from "@/store/useUser";
import type { UstadzDetailData } from "@/features/admin/types/ustad.type";
import type { RoleDetails } from "@/store/useUser";
import { formatTahapHafalan } from "@/utils/tahapHafalan";

function isUstadzDetail(details: RoleDetails | undefined): details is UstadzDetailData {
  return details !== null && details !== undefined && "waliKelasTahap" in details;
}

export default function UstadzLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUser();

  const baseSidebar = [
    { title: "Santri", url: "/ustadz", icon: GraduationCap },
    { title: "Peringkat", url: "/ustadz/peringkat/santri", icon: Trophy },
    { title: "Alquran", url: "/ustadz/alquran", icon: Book },
    { title: "Riwayat Terakhir", url: "/ustadz/riwayat/terakhir", icon: Notebook },
  ];

  const ustadzSidebar = [...baseSidebar];

  if (user?.role === "ustadz" && isUstadzDetail(user?.details)) {
    if (user.details.waliKelasTahap) {
      ustadzSidebar.push({
        title: `Kelas ${formatTahapHafalan(user.details.waliKelasTahap)}`,
        url: "/ustadz/kelas/tahapan",
        icon: User,
      });
    }
  }

  return (
    <Layout title="Ustadz Dashboard" sidebarItems={ustadzSidebar}>
      {children}
    </Layout>
  );
}