import { create } from "zustand";

type StatusFilter = "TambahHafalan" | "Murajaah";
type ModeFilter = "ayat" | "halaman";

interface SantriRiwayatState {
  statusFilter: StatusFilter;
  modeFilter: ModeFilter;
  currentPage: number;
  setStatusFilter: (status: StatusFilter) => void;
  setModeFilter: (mode: ModeFilter) => void;
  setCurrentPage: (page: number) => void;
  reset: () => void;
}

const initialState = {
  statusFilter: "TambahHafalan" as StatusFilter,
  modeFilter: "ayat" as ModeFilter,
  currentPage: 1,
};

export const useSantriRiwayatStore = create<SantriRiwayatState>((set) => ({
  ...initialState,
  setStatusFilter: (status) => set({ statusFilter: status }),
  setModeFilter: (mode) => set({ modeFilter: mode }),
  setCurrentPage: (page) => set({ currentPage: page }),
  reset: () => set(initialState),
}));
