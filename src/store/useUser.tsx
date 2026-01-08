import type { SantriDetailData } from "@/features/admin/types/santri.type";
import type { UstadzDetailData } from "@/features/admin/types/ustad.type";
import type { OrtuDetailData } from "@/features/admin/types/ortu.type";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { filterDetailsByRole } from "@/utils/filterDetailsByRole";

export type Role = "santri" | "ustadz" | "ortu" | "admin";

export type RoleDetails =
  | SantriDetailData
  | UstadzDetailData
  | OrtuDetailData
  | null;

export interface User {
  id: string;
  roleId: string;
  email: string;
  role: Role;
  details?: RoleDetails;
}

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  updateUser: (updatedData: Partial<User>) => void;
}

const useUser = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user: User) => set({ user }),
      clearUser: () => set({ user: null }),
      updateUser: (updatedData: Partial<User>) =>
        set((state) => {
          if (!state.user) return { user: null };
      
          const merged = { ...state.user, ...updatedData };
          return { user: filterDetailsByRole(merged) };
        }),
    }),
    {
      name: "user",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useUser;
