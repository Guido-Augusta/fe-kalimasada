import { create } from "zustand";

interface SantriState {
  currentPage: number;
  searchQuery: string;
  searchFilter: string;
  selectedTahap: string;
  setState: (partial: Partial<SantriState>) => void;
  reset: () => void;
}

const initialState = {
  currentPage: 1,
  searchQuery: "",
  searchFilter: "",
  selectedTahap: "Level1",
};

export const useSantriStore = create<SantriState>((set) => ({
  ...initialState,
  setState: (partial) => set((state) => ({ ...state, ...partial })),
  reset: () => set(initialState),
}));
