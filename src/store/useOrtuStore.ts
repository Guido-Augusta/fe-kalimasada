import { create } from "zustand";

interface OrtuState {
  currentPage: number;
  searchQuery: string;
  searchFilter: string;
  setState: (partial: Partial<OrtuState>) => void;
  reset: () => void;
}

const initialState = {
  currentPage: 1,
  searchQuery: "",
  searchFilter: "",
};

export const useOrtuStore = create<OrtuState>((set) => ({
  ...initialState,
  setState: (partial) => set((state) => ({ ...state, ...partial })),
  reset: () => set(initialState),
}));
