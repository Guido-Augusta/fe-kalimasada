import { create } from "zustand";

interface PeringkatState {
  currentPage: number;
  searchQuery: string;
  searchTerm: string;
  selectedTahap: string;
  setState: (partial: Partial<PeringkatState>) => void;
  reset: () => void;
}

const initialState = {
  currentPage: 1,
  searchQuery: "",
  searchTerm: "",
  selectedTahap: "Level1",
};

export const usePeringkatStore = create<PeringkatState>((set) => ({
  ...initialState,
  setState: (partial) => set((state) => ({ ...state, ...partial })),
  reset: () => set(initialState),
}));
