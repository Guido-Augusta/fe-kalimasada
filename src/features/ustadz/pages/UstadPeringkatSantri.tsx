import PeringkatTable from "@/components/share/PeringkatTable";
import UstadzLayout from "../components/UstadzLayout";

export default function UstadPeringkatSantri() {
  return (
    <UstadzLayout>
      <PeringkatTable baseUrl="/ustadz"/>
    </UstadzLayout>
  )
}