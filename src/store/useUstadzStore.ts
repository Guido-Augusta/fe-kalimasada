import { create } from "zustand";

interface UstadzState {
  currentPage: number;
  searchQuery: string;
  searchFilter: string;
  setState: (partial: Partial<UstadzState>) => void;
  reset: () => void;
}

const initialState = {
  currentPage: 1,
  searchQuery: "",
  searchFilter: "",
};

export const useUstadzStore = create<UstadzState>((set) => ({
  ...initialState,
  setState: (partial) => set((state) => ({ ...state, ...partial })),
  reset: () => set(initialState),
}));
