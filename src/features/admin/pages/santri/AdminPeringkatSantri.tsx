import PeringkatTable from "@/components/share/PeringkatTable";
import AdminLayout from "../../components/AdminLayout";

export default function AdminPeringkatSantri() {
  return (
    <AdminLayout>
      <PeringkatTable baseUrl="/admin" />
    </AdminLayout>
  )
}
