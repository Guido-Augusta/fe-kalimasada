import { create } from "zustand";
import type { HafalanStatus } from "@/features/ustadz/types/hafalan.type";

type StatusFilter = HafalanStatus;
type SortByAyat = "asc" | "desc" | null;
type SortByHalaman = "asc" | "desc" | null;
type ModeFilter = "surah" | "juz";

interface RiwayatTerakhirState {
  statusFilter: StatusFilter;
  currentPage: number;
  searchName: string;
  searchFilter: string;
  selectedTahap: string;
  sortByAyat: SortByAyat;
  sortByHalaman: SortByHalaman;
  mode: ModeFilter;
  setState: (partial: Partial<RiwayatTerakhirState>) => void;
  setCurrentPage: (page: number) => void;
  setStatusFilter: (status: StatusFilter) => void;
  reset: () => void;
}

const initialState = {
  statusFilter: "TambahHafalan" as StatusFilter,
  currentPage: 1,
  searchName: "",
  searchFilter: "",
  selectedTahap: "Level1",
  sortByAyat: null,
  sortByHalaman: null,
  mode: "surah" as ModeFilter,
};

export const useRiwayatTerakhirStore = create<RiwayatTerakhirState>((set) => ({
  ...initialState,
  setStatusFilter: (status) => set({ statusFilter: status }),
  setState: (partial) => set((state) => ({ ...state, ...partial })),
  setCurrentPage: (page) => set((state) => ({ ...state, currentPage: page })),
  reset: () => set(initialState),
}));
