import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfileUstadz } from "../service/ustadEditProfile.service";
import toast from "react-hot-toast";
import useUser from "@/store/useUser";
import type { UstadzDetailData } from "@/features/admin/types/ustad.type";

export type UpdateProfileResponse = {
  message: string;
  status: number;
  data: UstadzDetailData;
};

export const useUpdateProfileUstadzMutation = () => {
  const queryClient = useQueryClient();
  const { updateUser } = useUser();

  return useMutation({
    mutationFn: updateProfileUstadz,
    onSuccess: (data: UpdateProfileResponse) => {
      toast.success("Profil berhasil diperbarui.");

      queryClient.setQueryData<UstadzDetailData | undefined>(['profile-ustadz'], (oldData) => {
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
    onError: (_err) => {
      // toast.error(err.message || "Terjadi kesalahan.");
      toast.error("Gagal memperbarui profile");
    },
  });
};