import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useUpdateSantriMutation } from "@/features/admin/hooks/useSantriData";
import { toast } from "react-hot-toast";

interface UpdateHafalanDialogProps {
  santriData: {
    id: number;
    nama: string;
    tahapHafalan: string;
    orangTua: { id: number; tipe: string }[];
  };
  isOpen: boolean;
  onClose: () => void;
}

const tahapHafalanOptions = [
  { value: "Level1", label: "Level 1 - Juz 30" },
  { value: "Level2", label: "Level 2 - Surat Wajib" },
  { value: "Level3", label: "Level 3 - Juz 1-29" },
];

export default function UpdateHafalanDialog({
  santriData,
  isOpen,
  onClose,
}: UpdateHafalanDialogProps) {
  const [selectedHafalan, setSelectedHafalan] = useState(
    santriData.tahapHafalan
  );
  const updateMutation = useUpdateSantriMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nama", santriData.nama);
    formData.append("tahapHafalan", selectedHafalan);
    formData.append(
      "ortuId",
      JSON.stringify(santriData.orangTua.map((p) => p.id))
    );

    updateMutation.mutate(
      { id: santriData.id.toString(), formData: formData },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (_error) => {
          // toast.error(`Gagal memperbarui: ${error.message}`);
          toast.error(`Gagal memperbarui tahap hafalan`);
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-auto">
        <DialogHeader>
          <DialogTitle>Ubah Tahap Hafalan</DialogTitle>
          <DialogDescription>
            Pilih tahap hafalan baru untuk santri ini.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <Label htmlFor="tahapHafalan" className="w-[100px]">
                Tahap
              </Label>
              <Select
                value={selectedHafalan}
                onValueChange={setSelectedHafalan}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tahap hafalan..." />
                </SelectTrigger>
                <SelectContent>
                  {tahapHafalanOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}