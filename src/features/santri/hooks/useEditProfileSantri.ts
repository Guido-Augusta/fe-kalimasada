import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfileSantri } from "../service/santriEditProfile.service";
import toast from "react-hot-toast";
import type { SantriDetailData } from "@/features/admin/types/santri.type";
import useUser from "@/store/useUser";

export type UpdateProfileResponse = {
  message: string;
  status: number;
  data: SantriDetailData;
};

export const useUpdateProfileSantriMutation = () => {
  const { updateUser } = useUser();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfileSantri,
    onSuccess: (data: UpdateProfileResponse) => {
      toast.success("Profil berhasil diperbarui.");

      queryClient.setQueryData<SantriDetailData | undefined>(['profile-santri'], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          fotoProfil: data.data.fotoProfil 
        };
      });

      updateUser({
          details: {
              ...data.data,
              fotoProfil: data.data.fotoProfil
          }
      });
    },
    onError: (_error) => {
      // toast.error(error.message || "Terjadi kesalahan.");
      toast.error("Gagal memperbarui profile");
    },
  });
};