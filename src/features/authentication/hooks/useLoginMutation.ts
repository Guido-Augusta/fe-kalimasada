import { useMutation } from '@tanstack/react-query';
import { toast } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { loginSchema } from '../validation/auth.validation';
import { loginUser, type LoginResponse } from '../service/auth.service';
import useUser, { type Role, type RoleDetails } from '@/store/useUser';
import { fetchOrtuDetail } from '@/features/admin/service/ortu.service';
import { fetchSantriDetail } from '@/features/admin/service/santri.service';
import { fetchUstadzDetail } from '@/features/admin/service/ustadz.service';

type LoginFormValues = z.infer<typeof loginSchema>;

const roleRedirect: Record<string, string> = {
  admin: "/admin",
  ustadz: "/ustadz",
  santri: "/santri",
  ortu: "/ortu",
};

export const useLoginMutation = () => {
  const navigate = useNavigate();
  const { setUser, updateUser } = useUser();

  return useMutation<LoginResponse, Error, LoginFormValues>({
    mutationFn: loginUser,
    onSuccess: async (data) => {
      if (data.token && data.user) {
        setUser({
          id: data.user.id,
          roleId: data.user.roleId,
          email: data.user.email,
          role: data.user.role as Role,
        });
    
        localStorage.setItem("authToken", data.token);
    
        try {
          let details: RoleDetails | null = null;
          switch (data.user.role) {
            case "santri":
              details = await fetchSantriDetail(data.user.roleId);
              break;
            case "ustadz":
              details = await fetchUstadzDetail(data.user.roleId);
              break;
            case "ortu":
              details = await fetchOrtuDetail(data.user.roleId);
              break;
          }
    
          updateUser({ details });
        } catch (_err) {
          // console.error("Gagal fetch detail user:", err);
        }
      }
    
      toast.success("Login berhasil!");
      navigate(roleRedirect[data.user.role] || "/");
    },
    onError: (error) => {
      // toast.error(error.message || 'Login gagal. Silakan coba lagi.');
      if (error.message === "Invalid credentials") {
        toast.error("Email atau password salah");
      } else {
        toast.error("Login gagal. Silakan coba lagi.");
      }
    },
  });
};
