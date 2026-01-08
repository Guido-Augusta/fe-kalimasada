import { create } from "zustand";

type StatusFilter = "TambahHafalan" | "Murajaah";

interface SantriRiwayatState {
  statusFilter: StatusFilter;
  currentPage: number;
  setStatusFilter: (status: StatusFilter) => void;
  setCurrentPage: (page: number) => void;
  reset: () => void;
}

const initialState = {
  statusFilter: "TambahHafalan" as StatusFilter,
  currentPage: 1,
};

export const useSantriRiwayatStore = create<SantriRiwayatState>((set) => ({
  ...initialState,
  setStatusFilter: (status) => set({ statusFilter: status }),
  setCurrentPage: (page) => set({ currentPage: page }),
  reset: () => set(initialState),
}));
