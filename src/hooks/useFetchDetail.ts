import { fetchOrtuDetail } from "@/features/admin/service/ortu.service";
import { fetchSantriDetail } from "@/features/admin/service/santri.service";
import { fetchUstadzDetail } from "@/features/admin/service/ustadz.service";
import { useQuery } from "@tanstack/react-query";

export const useFetchDetail = (roleId: string | undefined, role: string | undefined) => {
  return useQuery({
    queryKey: ["user-detail", role, roleId],
    queryFn: async () => {
      if (!roleId || !role) return null;

      switch (role) {
        case "santri":
          return await fetchSantriDetail(roleId);
        case "ustadz":
          return await fetchUstadzDetail(roleId);
        case "ortu":
          return await fetchOrtuDetail(roleId);
        default:
          return null;
      }
    },
    enabled: !!roleId && !!role,
  });
};
