import type { RoleDetails, User } from "@/store/useUser";

export function filterDetailsByRole(user: User): User {
  let details: RoleDetails | null;

  switch (user.role) {
    case "admin":
      details = null;
      break;

    case "ortu":
      details = {
        id: user.details?.id,
        nama: user.details?.nama,
        alamat: user.details?.alamat,
        fotoProfil: user.details?.fotoProfil,
        nomorHp: user.details?.nomorHp,
        jenisKelamin: user.details?.jenisKelamin,
      }as RoleDetails;
      break;

    case "santri":
      details = {
        id: user.details?.id,
        nama: user.details?.nama,
        fotoProfil: user.details?.fotoProfil,
        nomorHp: user.details?.nomorHp,
        jenisKelamin: user.details?.jenisKelamin,
      } as RoleDetails;
      break;

    default:
      details = user.details ?? null;
  }

  return {
    ...user,
    details,
  };
}
