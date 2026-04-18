import type { RoleDetails, User } from "@/store/useUser";
import type { OrtuDetailData } from "@/features/admin/types/ortu.type";
import type { SantriDetailData } from "@/features/admin/types/santri.type";

export function filterDetailsByRole(user: User): User {
  let details: RoleDetails | null;

  switch (user.role) {
    case "admin":
      details = null;
      break;

    case "ortu": {
      const ortuDetails = user.details as OrtuDetailData;
      details = {
        id: ortuDetails?.id,
        userId: ortuDetails?.userId,
        nama: ortuDetails?.nama,
        alamat: ortuDetails?.alamat,
        fotoProfil: ortuDetails?.fotoProfil,
        nomorHp: ortuDetails?.nomorHp,
        jenisKelamin: ortuDetails?.jenisKelamin,
      } as RoleDetails;
      break;
    }

    case "santri": {
      const santriDetails = user.details as SantriDetailData;
      details = {
        id: santriDetails?.id,
        userId: santriDetails?.userId,
        nama: santriDetails?.nama,
      } as RoleDetails;
      break;
    }

    default:
      details = user.details ?? null;
  }

  return {
    ...user,
    details,
  };
}
