import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { updateProfileOrtu } from "../service/ortuEditProfile.service";
import useUser from "@/store/useUser";
import type { OrtuDetailData } from "@/features/admin/types/ortu.type";

export type UpdateProfileResponse = {
  message: string;
  status: number;
  data: OrtuDetailData;
};

export const useUpdateProfileOrtuMutation = () => {
  const { updateUser } = useUser();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfileOrtu,
    onSuccess: (data: UpdateProfileResponse) => {
      toast.success("Profil berhasil diperbarui.");
      queryClient.setQueryData<OrtuDetailData | undefined>(['profile-ortu'], (oldData) => {
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
      // toast.error(error.message);
      toast.error("Gagal memperbarui profile");
    },
  });
};