import SantriLayout from "../components/SantriLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import DoaKhatam from "@/components/share/DoaKhatam";

export default function DoakKhatamSantri() {
  const navigate = useNavigate();
  return (
    <SantriLayout>
      <div className="container mx-auto">
        <div className="mb-4">
          <Button onClick={() => navigate(-1)} variant="outline" className="flex items-center bg-yellow-500 text-white hover:bg-yellow-600 hover:text-white">
            <ChevronLeft size={20} className="mr-2" /> Kembali
          </Button>
        </div>
        <DoaKhatam/>
      </div>
    </SantriLayout>
  )
}
