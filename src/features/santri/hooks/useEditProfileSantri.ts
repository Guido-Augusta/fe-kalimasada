import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfileSantri } from "../service/santriEditProfile.service";
import toast from "react-hot-toast";
import type { SantriDetailData } from "@/features/admin/types/santri.type";

export type UpdateProfileResponse = {
  message: string;
  status: number;
  data: SantriDetailData;
};

export const useUpdateProfileSantriMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfileSantri,
    onSuccess: (_data: UpdateProfileResponse) => {
      toast.success("Profil berhasil diperbarui.");
      
      queryClient.invalidateQueries({ queryKey: ['profile-santri'] });
    },
    onError: (_error) => {
      // toast.error(error.message || "Terjadi kesalahan.");
      toast.error("Gagal memperbarui profile");
    },
  });
};